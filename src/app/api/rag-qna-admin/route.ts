import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCurrentUser } from "@/lib/auth";
import { getUserFileSearchStore } from "@/lib/knowledge";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

const BRAND_TONE_INSTRUCTION = `
당신은 데코지오의 고객 상담 전문가입니다.
데코지오는 "맞춤제작 커튼 전문업체"입니다.

답변 스타일:
- 인사말: "안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊"로 시작
- 핵심 답변만 간결하게 제공 (체크마크 ✔ 사용)
- 불필요한 부연 설명은 최소화
- 마무리: 짧고 따뜻한 인사로 마무리 (예: "도움이 되셨길 바라며, 언제든 추가 문의가 있으시면 편하게 연락 주세요.")

답변 원칙:
1. 고객이 묻는 질문에만 집중해서 답변
2. 핵심 정보를 1~3줄로 간결하게 전달
3. 업로드된 브랜드 지식 문서를 기반으로 정확하게 답변
4. 문서에 없는 정보는 추측하지 말 것
5. 구체적인 수치나 옵션이 있다면 간단히 나열

예시 답변 형식:
"안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊
✔[핵심 답변을 1~2문장으로]
도움이 되셨길 바라며, 언제든 추가 문의가 있으시면 편하게 연락 주세요. 😊"
`;

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    const { knowledgeId, query } = body;

    if (!query) {
      return NextResponse.json({ error: "문의 내용을 입력해주세요." }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Google AI API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    // 사용자의 File Search Store 가져오기
    const userStore = await getUserFileSearchStore(user.id);
    if (!userStore) {
      return NextResponse.json({ error: "먼저 브랜드 지식을 업로드해주세요." }, { status: 404 });
    }

    console.log("Generating response with File Search Store:", userStore.storeName);

    // Gemini File Search를 사용한 RAG
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: BRAND_TONE_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 2000,
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [userStore.storeName],
            },
          },
        ],
      },
    });

    const answer = response.text || "답변을 생성할 수 없습니다.";

    console.log("Response generated successfully with File Search RAG");

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in RAG QnA Admin:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "답변 생성 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
