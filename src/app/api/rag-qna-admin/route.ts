import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/session';
import { getUserFileSearchStore } from '@/lib/knowledge';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

const BRAND_TONE_INSTRUCTION = `
당신은 데코지오의 고객 상담 전문가입니다.
데코지오는 "맞춤제작 커튼 전문업체"입니다.

답변 톤:
- 인사말: "안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊"
- 친절하고 전문적인 톤 유지
- 구체적이고 명확한 정보 제공
- 마무리는 "추가 문의사항이 있으시면 언제든 문의해 주세요!" 등으로 마무리

답변 시 다음을 참고하세요:
1. 업로드된 브랜드 지식 문서를 기반으로 답변합니다.
2. 고객이 궁금해하는 핵심 정보를 명확하게 전달합니다.
3. 치수, 수량, 가격 등 구체적인 정보를 포함합니다.
4. 이음선, 레일, 추가요금 등 중요한 사항은 반드시 안내합니다.
5. 문서에 없는 정보는 추측하지 말고 명확하게 안내합니다.
`;

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { knowledgeId, query } = body;

    if (!query) {
      return NextResponse.json(
        { error: '문의 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 사용자의 File Search Store 가져오기
    const userStore = getUserFileSearchStore(session.userId);
    if (!userStore) {
      return NextResponse.json(
        { error: '먼저 브랜드 지식을 업로드해주세요.' },
        { status: 404 }
      );
    }

    console.log('Generating response with File Search Store:', userStore.storeName);

    // Gemini File Search를 사용한 RAG
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: query,
      systemInstruction: BRAND_TONE_INSTRUCTION,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [userStore.storeName],
            },
          },
        ],
      },
    });

    const answer = response.text || '답변을 생성할 수 없습니다.';

    console.log('Response generated successfully with File Search RAG');

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in RAG QnA Admin:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '답변 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
