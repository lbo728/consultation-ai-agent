import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserSafeData } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: '아이디는 3자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 사용자 생성
    const user = await createUser(username, password);

    // 세션 생성
    const sessionId = createSession(user.id);

    // 쿠키에 세션 ID 저장
    const response = NextResponse.json({
      success: true,
      user: getUserSafeData(user),
    });

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
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
