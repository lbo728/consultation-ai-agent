import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getKnowledgeFilesByUserId, getKnowledgeFileSafeData } from '@/lib/knowledge';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const sessionId = request.cookies.get('sessionId')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: '세션이 만료되었습니다.' }, { status: 401 });
    }

    // 사용자의 지식 파일 목록 가져오기
    const files = await getKnowledgeFilesByUserId(session.userId);
    const safeFiles = files.map(getKnowledgeFileSafeData);

    return NextResponse.json({ files: safeFiles });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '파일 목록을 가져오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
