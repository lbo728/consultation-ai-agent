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

<<<<<<< HEAD
    // 서버 사이드 Supabase 클라이언트로 로그인
    const supabase = await getServerSupabase();
=======
    // 서버 사이드 Supabase 클라이언트로 로그인 (쿠키 자동 설정)
    const supabase = getServerSupabase();
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: '로그인에 실패했습니다.' },
        { status: 401 }
      );
    }
<<<<<<< HEAD

    const user = {
      id: data.user.id,
      email: data.user.email!,
      createdAt: new Date(data.user.created_at),
    };
=======
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)

    return NextResponse.json({
      success: true,
      user: getUserSafeData(data.user),
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
