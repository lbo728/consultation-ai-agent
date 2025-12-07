import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCurrentUser } from "@/lib/auth";
import {
  createKnowledgeFile,
  getKnowledgeFileSafeData,
  getUserFileSearchStore,
  createUserFileSearchStore,
  updateKnowledgeFileGeminiInfo,
} from "@/lib/knowledge";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Google AI API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    // 파일 받기
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
    }

    // 파일 내용 읽기
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const content = buffer.toString('utf-8');

    // 임시 파일로 저장 (Gemini API가 파일 경로를 요구함)
    tempFilePath = join(tmpdir(), `${crypto.randomUUID()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    console.log("Uploading file to Gemini:", file.name);

    // 1. 사용자별 File Search Store 확인 또는 생성
    let userStore = await getUserFileSearchStore(user.id);

    if (!userStore) {
      console.log("Creating new File Search Store for user:", user.id);
      const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: `store-${user.id}` },
      });

      if (!fileSearchStore.name) {
        throw new Error("Failed to create File Search Store: no name returned");
      }

      userStore = await createUserFileSearchStore(user.id, fileSearchStore.name);
      console.log("Created File Search Store:", userStore.storeName);
    }

    // 2. File Search Store에 파일 직접 업로드
    console.log("Uploading file to File Search Store...");

    // MIME 타입 결정
    let mimeType = file.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      // 확장자로 MIME 타입 추론
      const ext = file.name.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'txt':
          mimeType = 'text/plain';
          break;
        case 'md':
          mimeType = 'text/markdown';
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        default:
          mimeType = 'text/plain';
      }
    }

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: tempFilePath,
      fileSearchStoreName: userStore.storeName,
      config: {
        displayName: file.name,
        mimeType: mimeType,
      },
    });

    // 3. 업로드 작업 완료 대기
    console.log("Waiting for upload operation to complete...");
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      operation = await ai.operations.get({ operation });
    }

    console.log("File uploaded and indexed successfully");

    // 4. 로컬 DB에 지식 파일 저장
    const knowledgeFile = await createKnowledgeFile(user.id, file.name, content);

    // Gemini 정보 업데이트
    await updateKnowledgeFileGeminiInfo(knowledgeFile.id, userStore.storeName, file.name);

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
    console.error("Upload error:", error);

    // 임시 파일 정리
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup temp file:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
