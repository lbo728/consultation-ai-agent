import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { getSession } from '@/lib/session';
import {
  createKnowledgeFile,
  getKnowledgeFileSafeData,
  getUserFileSearchStore,
  createUserFileSearchStore,
  updateKnowledgeFileGeminiInfo,
} from '@/lib/knowledge';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // 인증 확인
    const sessionId = request.cookies.get('sessionId')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: '세션이 만료되었습니다.' }, { status: 401 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 파일 받기
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
    }

    // 파일 내용 읽기
    const content = await file.text();
    const buffer = Buffer.from(content);

    // 임시 파일로 저장 (Gemini API가 파일 경로를 요구함)
    tempFilePath = join(tmpdir(), `${crypto.randomUUID()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    console.log('Uploading file to Gemini:', file.name);

    // 1. 사용자별 File Search Store 확인 또는 생성
    let userStore = getUserFileSearchStore(session.userId);

    if (!userStore) {
      console.log('Creating new File Search Store for user:', session.userId);
      // File Search Store 생성
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/fileSearchStores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_AI_API_KEY,
        },
        body: JSON.stringify({
          displayName: `store-${session.userId}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create File Search Store: ${JSON.stringify(errorData)}`);
      }

      const storeData = await response.json();
      userStore = createUserFileSearchStore(session.userId, storeData.name);
      console.log('Created File Search Store:', userStore.storeName);
    }

    // 2. Gemini에 파일 업로드
    console.log('Uploading to Gemini File Manager...');
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type || 'text/plain',
      displayName: file.name,
    });

    console.log('File uploaded to Gemini:', uploadResult.file.uri);

    // 3. File Search Store에 문서 추가
    console.log('Adding document to File Search Store...');
    const importResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${userStore.storeName}/documents:import`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_AI_API_KEY,
        },
        body: JSON.stringify({
          source: {
            file: {
              name: uploadResult.file.name,
            },
          },
        }),
      }
    );

    if (!importResponse.ok) {
      const errorData = await importResponse.json();
      throw new Error(`Failed to import document: ${JSON.stringify(errorData)}`);
    }

    const importData = await importResponse.json();
    console.log('Document imported to File Search Store');

    // 4. 로컬 DB에 지식 파일 저장
    const knowledgeFile = createKnowledgeFile(session.userId, file.name, content);

    // Gemini 정보 업데이트
    updateKnowledgeFileGeminiInfo(
      knowledgeFile.id,
      userStore.storeName,
      uploadResult.file.name
    );

    // 임시 파일 삭제
    if (tempFilePath) {
      await unlink(tempFilePath);
      tempFilePath = null;
    }

    return NextResponse.json({
      success: true,
      file: getKnowledgeFileSafeData(knowledgeFile),
    });
  } catch (error) {
    console.error('Upload error:', error);

    // 임시 파일 정리
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
