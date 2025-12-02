// 간단한 세션 관리 (MVP용)
// 실제 프로덕션에서는 Redis나 데이터베이스 세션 사용

interface Session {
  userId: string;
  expiresAt: Date;
}

const sessions: Map<string, Session> = new Map();

export function createSession(userId: string): string {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  // 만료 체크
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
