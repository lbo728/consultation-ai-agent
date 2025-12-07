import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
