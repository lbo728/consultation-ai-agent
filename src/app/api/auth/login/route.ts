import { NextRequest, NextResponse } from 'next/server';
import { signIn, getUserSafeData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase Auth로 로그인
    const user = await signIn(email, password);

    return NextResponse.json({
      success: true,
      user: getUserSafeData(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
