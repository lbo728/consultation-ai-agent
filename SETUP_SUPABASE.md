# Supabase 설정 가이드

이 프로젝트는 Supabase를 데이터베이스와 인증 저장소로 사용합니다.

## 1. Supabase 프로젝트 정보

프로젝트 Reference: `ggdgqcjehtimzatiqvxn`

Supabase 프로젝트 URL: `https://ggdgqcjehtimzatiqvxn.supabase.co`

## 2. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ggdgqcjehtimzatiqvxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### API 키 찾는 방법:

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택 (ggdgqcjehtimzatiqvxn)
3. 좌측 메뉴에서 "Settings" → "API" 클릭
4. "Project API keys" 섹션에서:
   - `anon` `public` 키를 복사하여 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 설정
   - `service_role` `secret` 키를 복사하여 `SUPABASE_SERVICE_ROLE_KEY`에 설정

## 3. 데이터베이스 마이그레이션 실행

Supabase SQL Editor에서 다음 SQL 파일을 실행하세요:

1. Supabase 대시보드 → SQL Editor
2. `supabase/migrations/20250101000000_initial_schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행 (Run 버튼 클릭)

또는 Supabase CLI를 사용:

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# 프로젝트 링크
supabase link --project-ref ggdgqcjehtimzatiqvxn

# 마이그레이션 실행
supabase db push
```

## 4. 테스트 관리자 계정 생성

환경변수 설정이 완료되면 다음 스크립트를 실행하여 테스트 계정을 생성하세요:

```bash
npx tsx scripts/create-admin.ts
```

생성되는 계정 정보:
- 아이디: `admin`
- 비밀번호: `qwer1234!!`

## 5. 데이터베이스 스키마

생성되는 테이블:

### `users`
사용자 정보 (커스텀 인증)
- id (UUID, PK)
- username (TEXT, UNIQUE)
- password_hash (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### `sessions`
세션 관리 (쿠키 기반)
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- session_token (TEXT, UNIQUE)
- expires_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)

### `file_search_stores`
사용자별 Gemini File Search Store 매핑
- id (UUID, PK)
- user_id (UUID, FK → users.id, UNIQUE)
- store_name (TEXT)
- created_at (TIMESTAMPTZ)

### `knowledge_files`
업로드된 지식 파일 정보
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (TEXT)
- content (TEXT)
- size (INTEGER)
- gemini_file_search_store_name (TEXT)
- gemini_document_name (TEXT)
- uploaded_at (TIMESTAMPTZ)

## 6. 개발 서버 실행

모든 설정이 완료되면 개발 서버를 실행하세요:

```bash
npm run dev
```

http://localhost:3000/login 에서 로그인할 수 있습니다.

## 문제 해결

### "Missing environment variable" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 모든 환경변수가 올바르게 설정되었는지 확인
- 개발 서버를 재시작

### 데이터베이스 연결 오류

- Supabase 프로젝트가 활성화되어 있는지 확인
- API 키가 올바른지 확인
- Supabase 대시보드에서 프로젝트 상태 확인

### 마이그레이션 실행 오류

- SQL Editor에서 각 명령을 개별적으로 실행해보기
- 이미 테이블이 존재하는 경우, DROP TABLE을 먼저 실행하거나 무시

## 마이그레이션에서 인메모리로 롤백 (필요시)

만약 Supabase 사용을 중단하고 인메모리로 돌아가려면:

```bash
git checkout HEAD -- src/lib/auth.ts src/lib/session.ts src/lib/knowledge.ts
```
