import { NextRequest, NextResponse } from 'next/server';
import { getUserSafeData } from '@/lib/auth';
<<<<<<< HEAD
import { getServerSupabase } from '@/lib/supabase';
=======
import { getServerSupabase } from '@/lib/supabase';
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)

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

    // 서버 사이드 Supabase 클라이언트로 회원가입
<<<<<<< HEAD
    const supabase = await getServerSupabase();
=======
    const supabase = getServerSupabase();
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: '사용자 생성에 실패했습니다.' },
<<<<<<< HEAD
        { status: 500 }
      );
    }

    const user = {
      id: data.user.id,
      email: data.user.email!,
      createdAt: new Date(data.user.created_at),
    };
=======
        { status: 400 }
      );
    }
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)

    return NextResponse.json({
      success: true,
      user: getUserSafeData(data.user),
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
