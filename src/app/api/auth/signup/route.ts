import { NextRequest, NextResponse } from 'next/server';
import { signUp, getUserSafeData } from '@/lib/auth';

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

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // Supabase Auth로 회원가입
    const user = await signUp(email, password);

    return NextResponse.json({
      success: true,
      user: getUserSafeData(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
