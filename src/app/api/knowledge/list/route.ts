import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getKnowledgeFilesByUserId, getKnowledgeFileSafeData } from '@/lib/knowledge';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 사용자의 지식 파일 목록 가져오기
    const files = await getKnowledgeFilesByUserId(user.id);
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
