import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabase();
=======
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
