<<<<<<< HEAD
import { supabase, getServerSupabase } from '@/lib/supabase';
=======
import { supabase, createServerSupabaseClient } from '@/lib/supabase';
>>>>>>> 8edb6d2 (fix: Implement server-side session management with Supabase SSR)
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: Date;
}

export async function signUp(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('사용자 생성에 실패했습니다.');
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    createdAt: new Date(data.user.created_at),
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('로그인에 실패했습니다.');
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    createdAt: new Date(data.user.created_at),
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(client?: SupabaseClient): Promise<AuthUser | null> {
  // API Route에서 호출되는 경우 서버 사이드 클라이언트 사용
  const supabaseClient = client || (typeof window === 'undefined' ? await getServerSupabase() : supabase);

  const { data: { user }, error } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    createdAt: new Date(user.created_at),
  };
}

// 서버 사이드 API 라우트 전용 - 쿠키 기반 세션 읽기
export async function getCurrentUserServer(): Promise<AuthUser | null> {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    createdAt: new Date(user.created_at),
  };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

export function getUserSafeData(user: User | AuthUser) {
  return {
    id: user.id,
    email: 'email' in user ? user.email : (user as User).email,
    createdAt: 'createdAt' in user ? user.createdAt : new Date((user as User).created_at),
  };
}
