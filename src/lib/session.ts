// Supabase Auth를 사용하므로 커스텀 세션 관리는 필요 없습니다.
// auth.ts의 getSession()을 사용하세요.

import { supabase } from '@/lib/supabase';

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
