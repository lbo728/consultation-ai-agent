/**
 * 테스트 관리자 계정 생성 스크립트
 *
 * 실행: npx tsx scripts/create-admin.ts
 */

import { getServiceSupabase } from '../src/lib/supabase';
import bcrypt from 'bcryptjs';

async function createAdminAccount() {
  console.log('👤 관리자 계정 생성 중...\n');

  const username = 'admin';
  const password = 'qwer1234!!';

  try {
    const supabase = getServiceSupabase();

    // 기존 계정 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      console.log('⚠️  관리자 계정이 이미 존재합니다.');
      console.log('   아이디:', username);
      console.log('   User ID:', existingUser.id);
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
      console.error('❌ 관리자 계정 생성 실패:', error.message);
      return;
    }

    console.log('✅ 관리자 계정 생성 완료!');
    console.log('   아이디:', username);
    console.log('   비밀번호:', password);
    console.log('   User ID:', user.id);
    console.log('\n📝 이 계정으로 http://localhost:3000/login 에서 로그인할 수 있습니다.');

  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 오류 발생:', error.message);
    } else {
      console.error('❌ 알 수 없는 오류 발생');
    }
    process.exit(1);
  }
}

createAdminAccount();
