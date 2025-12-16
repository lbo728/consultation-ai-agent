import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCurrentUser } from "@/lib/auth";
import { getUserFileSearchStore } from "@/lib/knowledge";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    console.log("Debug API - User:", user);

    if (!user) {
      return NextResponse.json(
        {
          error: "로그인이 필요합니다.",
          debug: "user not authenticated",
        },
        { status: 401 }
      );
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Google AI API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    // 사용자의 File Search Store 가져오기
    const userStore = await getUserFileSearchStore(user.id);
    if (!userStore) {
      return NextResponse.json(
        {
          error: "File Search Store가 없습니다.",
          message: "먼저 브랜드 지식 파일을 업로드해주세요.",
        },
        { status: 404 }
      );
    }

    console.log("User Store Name:", userStore.storeName);

    try {
      // Store의 파일 목록 가져오기
      const filesList = await ai.fileSearchStores.list();
      // const filesList = await ai.fileSearchStores.list({
      //   fileSearchStoreName: userStore.storeName,
      // });

      console.log("Files List:", filesList);

      const myFileSearchStore = await ai.fileSearchStores.get({
        name: userStore.storeName,
      });

      return NextResponse.json({
        store: {
          name: userStore.storeName,
          createdAt: userStore.createdAt,
          myFileSearchStore: myFileSearchStore,
        },
        // files: filesList.files || [],
        // totalFiles: filesList.files?.length || 0,
      });
    } catch (listError) {
      console.error("List files error:", listError);

      // 파일 목록을 가져올 수 없으면 기본 정보만 반환
      return NextResponse.json({
        store: {
          name: userStore.storeName,
          createdAt: userStore.createdAt,
        },
        files: [],
        totalFiles: 0,
        warning: "파일 목록을 가져올 수 없습니다.",
        error: listError instanceof Error ? listError.message : String(listError),
      });
    }
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "디버그 정보 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
