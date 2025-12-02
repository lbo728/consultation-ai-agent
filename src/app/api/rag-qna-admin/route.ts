import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@/lib/session';
import { getKnowledgeFileById } from '@/lib/knowledge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
1. 제공된 사전 지식(문서)을 기반으로 답변합니다.
2. 고객이 궁금해하는 핵심 정보를 명확하게 전달합니다.
3. 치수, 수량, 가격 등 구체적인 정보를 포함합니다.
4. 이음선, 레일, 추가요금 등 중요한 사항은 반드시 안내합니다.
5. 사전 지식에 명시된 정보를 최우선으로 참고하여 답변합니다.
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

    if (!knowledgeId || !query) {
      return NextResponse.json(
        { error: '지식 ID와 문의 내용을 모두 제공해야 합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 지식 파일 가져오기
    const knowledgeFile = getKnowledgeFileById(knowledgeId);
    if (!knowledgeFile) {
      return NextResponse.json({ error: '지식 파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 사용자 권한 확인
    if (knowledgeFile.userId !== session.userId) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
    }

    console.log('Generating response with knowledge file:', knowledgeFile.name);

    // Chat Completions API로 답변 생성
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: BRAND_TONE_INSTRUCTION,
        },
        {
          role: 'user',
          content: `다음은 우리 브랜드의 사전 지식과 과거 문의 내역입니다. 이 정보를 참고하여 고객 문의에 답변해주세요.

=== 사전 지식 ===
${knowledgeFile.content}

=== 고객 문의 ===
${query}

위 사전 지식을 바탕으로 고객 문의에 대해 브랜드 톤에 맞게 답변해주세요.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || '답변을 생성할 수 없습니다.';

    console.log('Response generated successfully');

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
