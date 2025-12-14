import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getKnowledgeFileById } from '@/lib/knowledge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const file = await getKnowledgeFileById(id);

    if (!file) {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 본인의 파일인지 확인
    if (file.userId !== user.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    return NextResponse.json({
      file: {
        id: file.id,
        name: file.name,
        content: file.content,
        uploadedAt: file.uploadedAt,
      },
    });
  } catch (error) {
    console.error('View file error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '파일 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
