import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { deleteKnowledgeFile } from '@/lib/knowledge';

export async function DELETE(request: NextRequest) {
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

    // 파일 ID 받기
    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json({ error: '파일 ID가 필요합니다.' }, { status: 400 });
    }

    // 파일 삭제
    const success = deleteKnowledgeFile(fileId, session.userId);

    if (!success) {
      return NextResponse.json({ error: '파일을 찾을 수 없거나 삭제 권한이 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '파일 삭제 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
