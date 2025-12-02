import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

// 간단한 인메모리 사용자 저장소 (MVP용)
// 실제 프로덕션에서는 데이터베이스 사용
const users: Map<string, User> = new Map();

export async function createUser(username: string, password: string): Promise<User> {
  // 중복 체크
  if (findUserByUsername(username)) {
    throw new Error('이미 존재하는 사용자입니다.');
  }

  // 비밀번호 해싱
  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    createdAt: new Date(),
  };

  users.set(user.id, user);
  return user;
}

export function findUserByUsername(username: string): User | undefined {
  return Array.from(users.values()).find((user) => user.username === username);
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function getUserSafeData(user: User) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}
