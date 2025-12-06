import bcrypt from 'bcryptjs';
import { getServiceSupabase } from '@/lib/supabase';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export async function createUser(username: string, password: string): Promise<User> {
  const supabase = getServiceSupabase();

  // 중복 체크
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('이미 존재하는 사용자입니다.');
  }

  // 비밀번호 해싱
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`사용자 생성 실패: ${error.message}`);
  }

  return {
    id: data.id,
    username: data.username,
    passwordHash: data.password_hash,
    createdAt: new Date(data.created_at),
  };
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return undefined;
  }

  return {
    id: data.id,
    username: data.username,
    passwordHash: data.password_hash,
    createdAt: new Date(data.created_at),
  };
}

export async function findUserById(id: string): Promise<User | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return {
    id: data.id,
    username: data.username,
    passwordHash: data.password_hash,
    createdAt: new Date(data.created_at),
  };
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
