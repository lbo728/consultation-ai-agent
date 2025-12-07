-- Admin 계정 생성 SQL
-- Supabase SQL Editor에서 실행하세요

-- 기존 admin 계정 삭제 (있을 경우)
DELETE FROM public.users WHERE username = 'admin';

-- Admin 계정 생성
-- 아이디: admin
-- 비밀번호: qwer1234!!
INSERT INTO public.users (username, password_hash)
VALUES (
  'admin',
  '$2b$10$GKtTCRe/8HKtIMNBkLLqNuPWScI5w8D5SC0Xuhy2QG15PCN28u/5a'
);

-- 생성된 계정 확인
SELECT id, username, created_at FROM public.users WHERE username = 'admin';
