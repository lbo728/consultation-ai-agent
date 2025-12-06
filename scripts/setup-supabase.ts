/**
 * Supabase 마이그레이션 실행 및 테스트 계정 생성 스크립트
 *
 * 실행 방법:
 * 1. .env.local 파일에 Supabase 환경변수 설정
 * 2. npx tsx scripts/setup-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 환경변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '설정됨' : '미설정');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  console.log('📋 마이그레이션 파일 읽기...');

  const migrationPath = join(process.cwd(), 'supabase/migrations/20250101000000_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('🚀 마이그레이션 실행 중...');

  // SQL을 명령어 단위로 분리하여 실행
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    if (statement.startsWith('--') || statement.length === 0) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      if (error) {
        // 이미 존재하는 객체는 무시
        if (error.message.includes('already exists')) {
          console.log('⚠️  이미 존재하는 객체:', error.message.split(':')[0]);
        } else {
          console.error('❌ SQL 실행 오류:', error.message);
        }
      }
    } catch (err) {
      console.error('❌ SQL 실행 오류:', err);
    }
  }

  console.log('✅ 마이그레이션 완료');
}

async function createAdminAccount() {
  console.log('\n👤 관리자 계정 생성 중...');

  const username = 'admin';
  const password = 'qwer1234!!';

  // 기존 계정 확인
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (existingUser) {
    console.log('⚠️  관리자 계정이 이미 존재합니다.');
    return;
  }

  // 비밀번호 해싱
  const passwordHash = await bcrypt.hash(password, 10);

  // 사용자 생성
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      username,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ 관리자 계정 생성 실패:', error);
    return;
  }

  console.log('✅ 관리자 계정 생성 완료');
  console.log('   아이디:', username);
  console.log('   비밀번호:', password);
  console.log('   User ID:', user.id);
}

async function main() {
  console.log('🔧 Supabase 설정 시작\n');
  console.log('프로젝트 URL:', SUPABASE_URL);

  try {
    // 1. 마이그레이션 실행
    // await runMigration();

    // 2. 관리자 계정 생성
    await createAdminAccount();

    console.log('\n🎉 모든 설정이 완료되었습니다!');
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
