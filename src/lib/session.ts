import { getServiceSupabase } from '@/lib/supabase';

interface Session {
  userId: string;
  expiresAt: Date;
}

export async function createSession(userId: string): Promise<string> {
  const supabase = getServiceSupabase();
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error(`세션 생성 실패: ${error.message}`);
  }

  return sessionToken;
}

export async function getSession(sessionToken: string): Promise<Session | null> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single();

  if (error || !data) {
    return null;
  }

  const expiresAt = new Date(data.expires_at);

  // 만료 체크
  if (expiresAt < new Date()) {
    await deleteSession(sessionToken);
    return null;
  }

  return {
    userId: data.user_id,
    expiresAt,
  };
}

export async function deleteSession(sessionToken: string): Promise<void> {
  const supabase = getServiceSupabase();

  await supabase
    .from('sessions')
    .delete()
    .eq('session_token', sessionToken);
}

export async function cleanupExpiredSessions(): Promise<void> {
  const supabase = getServiceSupabase();

  await supabase
    .from('sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
}
