import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createKnowledgeFile, getKnowledgeFileSafeData } from '@/lib/knowledge';

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

    // 파일 받기
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
    }

    // 파일 내용 읽기
    const content = await file.text();

    // 지식 파일 생성
    const knowledgeFile = createKnowledgeFile(session.userId, file.name, content);

    return NextResponse.json({
      success: true,
      file: getKnowledgeFileSafeData(knowledgeFile),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
