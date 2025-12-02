# 실행 계획서: 브랜드 맞춤형 AI 상담 에이전트

---

# 태스크 분석 보고서

## 태스크 요약

| 항목                  | 내용                                                              |
| --------------------- | ----------------------------------------------------------------- |
| **원본 요청**         | 브랜드 맞춤형 AI 상담 에이전트 (오늘의집 판매자용 커튼 상담 SaaS) |
| **주요 타입**         | Fullstack (Next.js 웹 애플리케이션)                               |
| **총 이슈**           | 12개                                                              |
| **전체 복잡도**       | Moderate (중간)                                                   |
| **예상 총 소요 시간** | 약 1~2주 (1인 개발, 하루 3시간 기준)                              |

## 태스크 분류

**주요 영역**: Fullstack (Next.js 웹 애플리케이션)

**근거**: PRD에서 Next.js API Layer + Frontend 구조를 명시하고 있으며, Gemini API + File Search RAG를 활용한 AI 답변 생성 시스템 구축이 핵심입니다.

### 영향받는 하위 영역

- [x] 규칙 엔진 (Rule Engine)
- [x] AI/LLM 연동 (Gemini + File Search)
- [x] API 엔드포인트
- [x] UI 컴포넌트
- [x] 브랜드 데이터 관리
- [x] 문서 업로드/관리

---

# GitHub 이슈 목록

---

## Phase 1: 프로젝트 기반 설정

### Issue #1: `[Setup] 프로젝트 초기 설정 및 환경 구성`

**labels:**

- `type:setup`
- `area:infrastructure`
- `complexity:low`
- `priority:critical`

#### 설명

Next.js 프로젝트를 초기화하고, 필요한 의존성을 설치하며, 기본적인 프로젝트 구조를 설정합니다.

#### 작업 종류

- [x] Frontend
- [x] Backend
- [ ] Other

#### 완료 조건

- [ ] Next.js 14+ 프로젝트 초기화 (App Router)
- [ ] TypeScript 설정
- [ ] 환경 변수 설정 (.env.local)
  - `GOOGLE_API_KEY`
  - `GEMINI_MODEL_ID`
- [ ] 기본 폴더 구조 생성
  ```
  /app
    /api
      /brands/[brandId]/answer
    /page.tsx
  /lib
    /rule-engine
    /gemini
    /brands
  /components
  /data
    /brands
  ```
- [ ] 필요한 패키지 설치
  - `@google/generative-ai`
  - `tailwindcss`
  - `shadcn/ui` (선택)

#### 의존성

- 없음 (첫 번째 태스크)

---

## Phase 1: 핵심 백엔드 기능

### Issue #2: `[Backend] 커튼 규칙 엔진 구현`

**labels:**

- `type:feature`
- `area:backend`
- `complexity:moderate`
- `priority:critical`

#### 설명

커튼 치수 계산, 패널 조합, 이음선 발생 여부 등을 자동으로 계산하는 규칙 엔진을 구현합니다. 브랜드별 확장이 가능한 구조로 설계합니다.

#### 작업 종류

- [ ] Frontend
- [x] Backend
- [ ] Other

#### 완료 조건

- [ ] `/lib/rule-engine/curtain-calculator.ts` 구현
- [ ] 목표 가로폭 계산 (실측 가로 × 1.5배)
- [ ] 패널 조합 계산 (70/140/280/350 단위)
- [ ] 이음선 발생 여부 판단 (3장 이상 시 경고)
- [ ] 설치 타입별 높이 계산
  - 아일렛: 실측 - 1cm
  - 핀형: 실측 + 10cm
  - 박스: 박스 깊이에 따른 계산
- [ ] 레일 추천 로직 (박스 깊이 기준)
- [ ] JSON 출력 포맷 정의
  ```typescript
  interface CurtainCalculation {
    targetWidth: number;
    recommendedWidth: number;
    recommendedPanels: number;
    panelCombination: number[];
    recommendedHeight: number;
    hasSeam: boolean;
    seamWarning?: string;
    railRecommendation?: string;
  }
  ```
- [ ] 단위 테스트 작성 (최소 5개 케이스)

#### 의존성

- Issue #1 (프로젝트 초기 설정)

---

### Issue #3: `[Backend] 브랜드 데이터 모델 및 관리 시스템`

**labels:**

- `type:feature`
- `area:backend`
- `complexity:low`
- `priority:critical`

#### 설명

브랜드별 정보를 관리하는 데이터 모델과 브랜드 문서(policy.txt, qna.txt, tone.txt)를 로드하는 시스템을 구현합니다. MVP에서는 파일 기반으로 관리합니다.

#### 작업 종류

- [ ] Frontend
- [x] Backend
- [ ] Other

#### 완료 조건

- [ ] 브랜드 데이터 타입 정의
  ```typescript
  interface Brand {
    id: string;
    name: string;
    greeting: string;
    closing: string;
    systemPrompt: string;
    documents: {
      policy: string;
      qna: string;
      tone: string;
    };
  }
  ```
- [ ] `/data/brands/` 폴더 구조 생성
  ```
  /data/brands/
    /decogio/
      brand.json
      policy.txt
      qna.txt
      tone.txt
  ```
- [ ] 브랜드 로더 함수 구현 (`/lib/brands/loader.ts`)
- [ ] 데코지오 브랜드 샘플 데이터 생성
- [ ] 브랜드 목록 조회 함수

#### 의존성

- Issue #1 (프로젝트 초기 설정)

---

### Issue #4: `[Backend] Gemini API 연동 및 RAG 시스템`

**labels:**

- `type:feature`
- `area:backend`
- `area:ai`
- `complexity:moderate`
- `priority:critical`

#### 설명

Google Gemini API를 연동하고, 브랜드 문서를 컨텍스트로 활용하는 RAG 시스템을 구현합니다. File Search Store 대신 프롬프트 기반 컨텍스트 주입 방식으로 MVP를 구현합니다.

#### 작업 종류

- [ ] Frontend
- [x] Backend
- [ ] Other

#### 완료 조건

- [ ] `/lib/gemini/client.ts` - Gemini 클라이언트 초기화
- [ ] `/lib/gemini/prompt-builder.ts` - 시스템 프롬프트 빌더
  - 브랜드 톤 적용
  - 정책 문서 컨텍스트 주입
  - Q&A 패턴 참조
  - 규칙 엔진 결과 포함
- [ ] `/lib/gemini/answer-generator.ts` - 답변 생성 함수
- [ ] 에러 핸들링 및 fallback 메시지 처리
- [ ] 응답 시간 3~7초 이내 달성
- [ ] 토큰 사용량 최적화

#### 의존성

- Issue #1 (프로젝트 초기 설정)
- Issue #3 (브랜드 데이터 모델)

---

### Issue #5: `[Backend] AI 답변 생성 API 엔드포인트`

**labels:**

- `type:feature`
- `area:backend`
- `area:api`
- `complexity:moderate`
- `priority:critical`

#### 설명

고객 문의를 받아 AI 답변을 생성하는 핵심 API 엔드포인트를 구현합니다. 규칙 엔진, 브랜드 데이터, Gemini를 통합합니다.

#### 작업 종류

- [ ] Frontend
- [x] Backend
- [ ] Other

#### 완료 조건

- [ ] `POST /api/brands/[brandId]/answer` 엔드포인트 구현
- [ ] Request 스키마 정의 및 검증
  ```typescript
  interface AnswerRequest {
    question: string;
    sizeInfo?: {
      width?: number;
      height?: number;
      style?: "eyelet" | "pinch" | "box";
      boxDepth?: number;
    };
  }
  ```
- [ ] Response 스키마 정의
  ```typescript
  interface AnswerResponse {
    answer: string;
    calculation?: CurtainCalculation;
    processingTime: number;
  }
  ```
- [ ] 처리 흐름 구현
  1. 브랜드 데이터 로드
  2. 치수 정보 있으면 규칙 엔진 실행
  3. 프롬프트 빌드
  4. Gemini 호출
  5. 응답 반환
- [ ] 에러 응답 처리 (400, 404, 500)
- [ ] API 응답 시간 로깅

#### 의존성

- Issue #2 (규칙 엔진)
- Issue #3 (브랜드 데이터)
- Issue #4 (Gemini 연동)

---

## Phase 1: 프론트엔드 기능

### Issue #6: `[Frontend] 메인 페이지 레이아웃 및 기본 UI`

**labels:**

- `type:feature`
- `area:frontend`
- `complexity:low`
- `priority:high`

#### 설명

AI 상담 에이전트의 메인 페이지 레이아웃과 기본 UI 컴포넌트를 구현합니다.

#### 작업 종류

- [x] Frontend
- [ ] Backend
- [ ] Other

#### 완료 조건

- [x] 메인 페이지 레이아웃 (`/app/page.tsx`)
- [x] 헤더 컴포넌트 (브랜드 로고, 서비스명) - Hero 섹션에 포함
- [x] 반응형 디자인 (모바일 우선)
- [x] 기본 스타일링 (Tailwind CSS)
- [ ] 로딩 상태 UI
- [ ] 에러 상태 UI

#### 의존성

- Issue #1 (프로젝트 초기 설정)

---

### Issue #7: `[Frontend] 문의 입력 폼 컴포넌트`

**labels:**

- `type:feature`
- `area:frontend`
- `complexity:moderate`
- `priority:high`

#### 설명

고객 문의를 입력받고 선택적으로 치수 정보를 입력할 수 있는 폼 컴포넌트를 구현합니다.

#### 작업 종류

- [x] Frontend
- [ ] Backend
- [ ] Other

#### 완료 조건

- [ ] `/components/QuestionForm.tsx` 구현
- [ ] 문의 내용 텍스트 입력 (textarea)
  - placeholder: "오늘의집 Q&A에서 복사한 문의 내용을 붙여넣으세요"
  - 최소 높이 120px
- [ ] 치수 정보 입력 섹션 (토글로 펼침/접힘)
  - 가로 (cm) - number input
  - 세로 (cm) - number input
  - 설치 타입 - select (아일렛/핀형/박스)
  - 박스 깊이 (cm) - number input (박스 선택 시만 표시)
- [ ] 브랜드 선택 드롭다운
- [ ] "답변 생성" 버튼
- [ ] 폼 유효성 검증
- [ ] 제출 중 로딩 상태

#### 의존성

- Issue #6 (메인 페이지 레이아웃)

---

### Issue #8: `[Frontend] 답변 결과 표시 컴포넌트`

**labels:**

- `type:feature`
- `area:frontend`
- `complexity:low`
- `priority:high`

#### 설명

AI가 생성한 답변을 표시하고 클립보드 복사 기능을 제공하는 컴포넌트를 구현합니다.

#### 작업 종류

- [x] Frontend
- [ ] Backend
- [ ] Other

#### 완료 조건

- [ ] `/components/AnswerResult.tsx` 구현
- [ ] 답변 텍스트 표시 영역
  - 브랜드 톤에 맞는 스타일링
  - 읽기 쉬운 폰트 및 줄간격
- [ ] "복사하기" 버튼
  - 클릭 시 클립보드에 복사
  - 복사 완료 피드백 (토스트 또는 버튼 텍스트 변경)
- [ ] 계산 결과 표시 (치수 정보 입력 시)
  - 추천 폭, 장수, 이음선 여부 등
- [ ] 처리 시간 표시 (예: "3.2초 소요")
- [ ] 빈 상태 UI

#### 의존성

- Issue #6 (메인 페이지 레이아웃)

---

### Issue #9: `[Frontend] API 연동 및 상태 관리`

**labels:**

- `type:feature`
- `area:frontend`
- `complexity:moderate`
- `priority:high`

#### 설명

프론트엔드에서 답변 생성 API를 호출하고 결과를 관리하는 로직을 구현합니다.

#### 작업 종류

- [x] Frontend
- [ ] Backend
- [ ] Other

#### 완료 조건

- [ ] `/lib/api/answer.ts` - API 호출 함수
- [ ] React 상태 관리 (useState 또는 zustand)
  - 로딩 상태
  - 에러 상태
  - 답변 결과
- [ ] 에러 핸들링 및 사용자 피드백
- [ ] 폼 제출 → API 호출 → 결과 표시 플로우
- [ ] 재시도 로직 (네트워크 오류 시)

#### 의존성

- Issue #5 (API 엔드포인트)
- Issue #7 (문의 입력 폼)
- Issue #8 (답변 결과 표시)

---

## Phase 1: 데이터 및 테스트

### Issue #10: `[Data] 데코지오 브랜드 샘플 데이터 작성`

**labels:**

- `type:content`
- `area:data`
- `complexity:low`
- `priority:high`

#### 설명

첫 번째 고객사인 데코지오의 브랜드 정보와 정책 문서를 작성합니다. 실제 CS 패턴을 반영한 Q&A 데이터를 포함합니다.

#### 작업 종류

- [ ] Frontend
- [ ] Backend
- [x] Other: Content

#### 완료 조건

- [ ] `/data/brands/decogio/brand.json` 작성
  - 브랜드명, 인사말, 마무리 멘트
  - 시스템 프롬프트 초안
- [ ] `/data/brands/decogio/policy.txt` 작성
  - 치수 계산 규칙
  - 이음선 정책
  - 레일 추천 기준
  - 배송/교환/반품 정책
- [ ] `/data/brands/decogio/qna.txt` 작성
  - 자주 묻는 질문 20개 이상
  - 실제 CS 패턴 반영
- [ ] `/data/brands/decogio/tone.txt` 작성
  - 인사말 패턴
  - 마무리 멘트 패턴
  - 이모지 사용 가이드

#### 의존성

- Issue #3 (브랜드 데이터 모델)

---

### Issue #11: `[Test] E2E 테스트 및 시나리오 검증`

**labels:**

- `type:test`
- `area:qa`
- `complexity:moderate`
- `priority:medium`

#### 설명

주요 사용자 플로우에 대한 E2E 테스트를 작성하고, 다양한 문의 시나리오에서 답변 품질을 검증합니다.

#### 작업 종류

- [ ] Frontend
- [ ] Backend
- [x] Other: QA

#### 완료 조건

- [ ] 기본 플로우 테스트
  - 문의 입력 → 답변 생성 → 복사
- [ ] 치수 계산 시나리오 테스트 (5개 이상)
  - 소형 창문 (100cm 이하)
  - 중형 창문 (100~200cm)
  - 대형 창문 (200~300cm)
  - 초대형 (300cm 이상)
  - 이음선 발생 케이스
- [ ] 답변 품질 검증
  - 브랜드 톤 일관성
  - 계산 정확도
  - 정책 반영 여부
- [ ] 에러 케이스 테스트
  - 빈 입력
  - 잘못된 치수
  - API 타임아웃

#### 의존성

- Issue #9 (API 연동)
- Issue #10 (샘플 데이터)

---

### Issue #12: `[Deploy] 배포 및 데모 환경 구축`

**labels:**

- `type:deployment`
- `area:infrastructure`
- `complexity:low`
- `priority:medium`

#### 설명

MVP를 Vercel에 배포하고 데코지오에게 데모를 제공할 수 있는 환경을 구축합니다.

#### 작업 종류

- [ ] Frontend
- [ ] Backend
- [x] Other: DevOps

#### 완료 조건

- [ ] Vercel 프로젝트 연결
- [ ] 환경 변수 설정
- [ ] 도메인 설정 (선택: 커스텀 도메인)
- [ ] 배포 자동화 (main 브랜치 push 시)
- [ ] 프로덕션 환경 테스트
- [ ] 데모 URL 준비

#### 의존성

- Issue #11 (E2E 테스트)

---

# 이슈 의존성 다이어그램

```
Phase 1: 기반 설정
┌─────────────────────────────────────────────────────────────┐
│  #1 프로젝트 초기 설정                                        │
└─────────────────────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┬───────────────┐
    ▼               ▼               ▼               ▼
┌────────┐   ┌────────┐     ┌────────┐       ┌────────┐
│ #2     │   │ #3     │     │ #6     │       │ (독립) │
│ 규칙   │   │ 브랜드 │     │ 메인   │       │        │
│ 엔진   │   │ 데이터 │     │ 페이지 │       │        │
└────────┘   └────────┘     └────────┘       └────────┘
    │             │              │
    │             ▼              ├───────────┐
    │        ┌────────┐          ▼           ▼
    │        │ #4     │     ┌────────┐  ┌────────┐
    │        │ Gemini │     │ #7     │  │ #8     │
    │        │ 연동   │     │ 입력폼 │  │ 결과   │
    │        └────────┘     └────────┘  └────────┘
    │             │              │           │
    └──────┬──────┘              └─────┬─────┘
           ▼                           ▼
      ┌────────┐                  ┌────────┐
      │ #5     │                  │ #9     │
      │ API    │◄─────────────────│ API    │
      │ 엔드   │                  │ 연동   │
      └────────┘                  └────────┘
           │                           │
           └─────────────┬─────────────┘
                         ▼
                    ┌────────┐
                    │ #10    │
                    │ 샘플   │
                    │ 데이터 │
                    └────────┘
                         │
                         ▼
                    ┌────────┐
                    │ #11    │
                    │ E2E    │
                    │ 테스트 │
                    └────────┘
                         │
                         ▼
                    ┌────────┐
                    │ #12    │
                    │ 배포   │
                    └────────┘
```

---

# 실행 순서 요약

| 순서 | 이슈       | 작업                                         | 예상 소요 |
| ---- | ---------- | -------------------------------------------- | --------- |
| 1    | #1         | 프로젝트 초기 설정                           | 2시간     |
| 2    | #2, #3, #6 | 규칙 엔진, 브랜드 데이터, 메인 페이지 (병렬) | 4시간     |
| 3    | #4         | Gemini API 연동                              | 3시간     |
| 4    | #7, #8     | 입력 폼, 결과 표시 (병렬)                    | 3시간     |
| 5    | #5         | API 엔드포인트                               | 3시간     |
| 6    | #9         | API 연동                                     | 2시간     |
| 7    | #10        | 샘플 데이터 작성                             | 3시간     |
| 8    | #11        | E2E 테스트                                   | 3시간     |
| 9    | #12        | 배포                                         | 1시간     |

**총 예상 소요 시간**: 약 24시간 (하루 3시간 × 8일 ≈ 1.5주)

---

# 다음 단계

Phase 1 완료 후:

1. **Phase 2**: Web Admin 구축, 로그 저장/분석
2. **Phase 3**: 멀티 브랜드 지원, 고도화 기능
