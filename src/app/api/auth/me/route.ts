import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserSafeData } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    return NextResponse.json({ user: getUserSafeData(user) });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
