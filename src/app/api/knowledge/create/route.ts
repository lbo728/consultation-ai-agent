import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createKnowledgeFile, getUserFileSearchStore, createUserFileSearchStore, updateKnowledgeFileGeminiInfo } from '@/lib/knowledge';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, content } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: 'Google AI API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 1. DB에 지식 파일 저장
    const knowledgeFile = await createKnowledgeFile(user.id, name, content);

    // 2. 사용자의 File Search Store 확인 또는 생성
    let userStore = await getUserFileSearchStore(user.id);
    if (!userStore) {
      const storeName = `user-${user.id}-store`;
      const createResponse = await ai.fileSearchStores.create({
        displayName: storeName,
      });
      userStore = await createUserFileSearchStore(user.id, createResponse.name);
    }

    // 3. 임시 파일 생성 (Gemini API에 업로드하기 위해 필요)
    const tmpDir = os.tmpdir();
    const tmpFilePath = path.join(tmpDir, `${knowledgeFile.id}.txt`);
    fs.writeFileSync(tmpFilePath, content);

    try {
      // 4. File Search Store에 파일 업로드
      const operation = await ai.fileSearchStores.uploadToFileSearchStore(userStore.storeName, tmpFilePath);

      // 5. 업로드 완료 대기
      let uploadComplete = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!uploadComplete && attempts < maxAttempts) {
        const status = await ai.operations.get(operation.name);
        if (status.done) {
          uploadComplete = true;
          console.log('File upload completed:', status);

          // 6. Gemini 정보 업데이트
          if (status.response?.uploadedFiles?.[0]) {
            const documentName = status.response.uploadedFiles[0].name;
            await updateKnowledgeFileGeminiInfo(
              knowledgeFile.id,
              userStore.storeName,
              documentName
            );
          }
        } else {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (!uploadComplete) {
        console.error('File upload timeout');
      }
    } finally {
      // 7. 임시 파일 삭제
      if (fs.existsSync(tmpFilePath)) {
        fs.unlinkSync(tmpFilePath);
      }
    }

    return NextResponse.json({
      message: '지식이 성공적으로 추가되었습니다.',
      file: {
        id: knowledgeFile.id,
        name: knowledgeFile.name,
        size: knowledgeFile.size,
        uploadedAt: knowledgeFile.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '지식 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}
