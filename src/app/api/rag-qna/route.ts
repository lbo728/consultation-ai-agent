import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 데코지오 브랜드 톤 설정
const BRAND_TONE_INSTRUCTION = `
당신은 데코지오의 고객 상담 전문가입니다.
데코지오는 "맞춤제작 커튼 전문업체"입니다.

답변 톤:
- 인사말: "안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊"
- 친절하고 전문적인 톤 유지
- 구체적이고 명확한 정보 제공
- 마무리는 "추가 문의사항이 있으시면 언제든 문의해 주세요!" 등으로 마무리

답변 시 다음을 참고하세요:
1. 업로드된 사전 지식(문서)을 기반으로 답변합니다.
2. 고객이 궁금해하는 핵심 정보를 명확하게 전달합니다.
3. 치수, 수량, 가격 등 구체적인 정보를 포함합니다.
4. 이음선, 레일, 추가요금 등 중요한 사항은 반드시 안내합니다.
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const query = formData.get('query') as string;

    if (!file || !query) {
      return NextResponse.json(
        { error: '파일과 문의 내용을 모두 제공해야 합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 1. 파일 업로드
    console.log('Uploading file to OpenAI...');
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: 'assistants',
    });
    console.log('File uploaded:', uploadedFile.id);

    // 2. Vector Store 생성 및 파일 추가
    console.log('Creating vector store...');
    const vectorStore = await openai.beta.vectorStores.create({
      name: `Knowledge Base - ${Date.now()}`,
      file_ids: [uploadedFile.id],
    });
    console.log('Vector store created:', vectorStore.id);

    // 3. Assistant 생성 (File Search 도구 포함)
    console.log('Creating assistant...');
    const assistant = await openai.beta.assistants.create({
      name: 'Decozio Customer Support',
      instructions: BRAND_TONE_INSTRUCTION,
      model: 'gpt-4o',
      tools: [{ type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });
    console.log('Assistant created:', assistant.id);

    // 4. Thread 생성 및 메시지 추가
    console.log('Creating thread...');
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: query,
    });
    console.log('Thread and message created');

    // 5. Run 실행 및 완료 대기
    console.log('Running assistant...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Run 완료 대기
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // 30초 타임아웃

    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
    }

    if (runStatus.status !== 'completed') {
      throw new Error('Assistant response timeout');
    }

    console.log('Run completed');

    // 6. 응답 메시지 가져오기
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');

    if (!assistantMessage || !assistantMessage.content[0]) {
      throw new Error('No response from assistant');
    }

    // 7. 정리: Assistant와 Vector Store 삭제
    console.log('Cleaning up resources...');
    try {
      await openai.beta.assistants.del(assistant.id);
      await openai.beta.vectorStores.del(vectorStore.id);
      // Note: 파일은 자동으로 정리되지 않으므로 필요시 별도 관리
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    // 8. 응답 반환
    const answer =
      assistantMessage.content[0].type === 'text'
        ? assistantMessage.content[0].text.value
        : '답변을 생성할 수 없습니다.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in RAG QnA:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '답변 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
