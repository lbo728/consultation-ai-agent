# 랜딩페이지 실행 계획

---

## 태스크 분석

| 항목 | 내용 |
|------|------|
| **원본 요청** | AI 상담 에이전트 SaaS 랜딩페이지 제작 |
| **주요 타입** | Frontend (Next.js 16 랜딩페이지) |
| **총 섹션** | 10개 |
| **전체 복잡도** | Moderate |
| **예상 소요 시간** | 약 8~12시간 (하루 3시간 × 3~4일) |

---

## 진행 상황 체크리스트

### Phase 1: 기반 설정
- [x] #L1 프로젝트 초기 설정 (Next.js 16 + Tailwind) ✅

### Phase 2: 핵심 섹션
- [x] #L2 Hero 섹션 ✅
- [x] #L4 데모 섹션 (⭐ 전환 핵심) ✅
- [x] #L3 Before/After 섹션 ✅

### Phase 3: 기능 및 가격
- [x] #L5 핵심 기능 섹션 ✅
- [x] #L8 가격 플랜 섹션 ✅

### Phase 4: 신뢰 구축
- [x] #L6 가치/ROI 섹션 ✅
- [x] #L7 후기/Testimonials 섹션 ✅

### Phase 5: 마무리
- [x] #L9 FAQ 섹션 ✅
- [x] #L10 CTA + Footer 섹션 ✅

---

## 랜딩페이지 섹션 구조

```
[1. Hero] ─────────── 핵심 가치 전달 + CTA
[2. Before/After] ─── 문제-해결 시각화
[3. 데모] ─────────── ⭐ 전환 핵심 (계정 없이 체험)
[4. 핵심 기능] ────── 5가지 기능 설명
[5. 가치/ROI] ─────── 비용 대비 효과
[6. 후기] ─────────── 사회적 증거
[7. 가격 플랜] ────── Basic / Pro
[8. FAQ] ──────────── 불안 제거
[9. CTA] ──────────── 최종 전환 유도
[10. Footer] ─────── 신뢰 마무리
```

---

## GitHub 이슈 목록

### Issue #L1: `[Setup] 랜딩페이지 프로젝트 초기 설정`

**labels:** `type:setup`, `area:frontend`, `priority:critical`

**상태:** ✅ 완료

#### 완료 조건
- [x] Next.js 16 프로젝트 초기화 (App Router)
- [x] Tailwind CSS 설정
- [x] 폴더 구조 생성
  ```
  /app
    /page.tsx (랜딩페이지)
    /demo/page.tsx (데모 페이지)
  /components
    /landing
      Hero.tsx
      BeforeAfter.tsx
      Demo.tsx
      Features.tsx
      ROI.tsx
      Testimonials.tsx
      Pricing.tsx
      FAQ.tsx
      CTA.tsx
      Footer.tsx
  ```
- [x] 기본 레이아웃 및 폰트 설정 (Noto Sans KR)
- [x] 반응형 breakpoint 설정
- [x] lucide-react 아이콘 패키지 설치

**의존성:** 없음

---

### Issue #L2: `[Frontend] Hero 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:critical`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 헤드라인: "오늘의집 문의, 이제 AI가 5초 안에 대신 답해줄게."
- [ ] 서브 헤드라인: 브랜드 가이드·톤까지 그대로 따라가는 전용 AI 상담사
- [ ] CTA 버튼 2개
  - "7일 무료로 시작하기" (Primary)
  - "문의 붙여넣고 데모 보기" (Secondary)
- [ ] 옥션 포인트 4개 (배지 형태)
  - 단 5초 / 브랜드 전용 / 자동 장수 계산 / 이음선 자동 안내
- [ ] 히어로 애니메이션 (문의→답변 슬라이드)
- [ ] 반응형 디자인

**의존성:** Issue #L1

---

### Issue #L3: `[Frontend] Before/After 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:high`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] Before 카드 (기존 방식)
  - 고객 문의 30~60건 반복
  - 매번 장수/높이 계산
  - 오답 위험
  - 퇴근 후에도 문의 쌓임
- [ ] After 카드 (AI 상담사)
  - 문의 복붙 → 5초 답변
  - 브랜드 정책 기반 자동 계산
  - 고객 톤 유지
  - 하루 1~3시간 절약
- [ ] 시각적 대비 효과 (색상, 아이콘)
- [ ] 애니메이션 (스크롤 시 등장)

**의존성:** Issue #L1

---

### Issue #L4: `[Frontend] 데모 섹션 구현 (핵심)`

**labels:** `type:feature`, `area:frontend`, `area:backend`, `priority:critical`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 제목: "고객 문의 하나 붙여넣어보면 바로 이해돼."
- [ ] 문의 입력 텍스트박스
- [ ] "AI 답변 생성하기" 버튼
- [ ] 로딩 애니메이션 (3초)
- [ ] 답변 결과 표시 영역
- [ ] 부가 정보 표시
  - "브랜드 톤 자동 적용됨"
  - "장수 계산 / 이음선 여부 자동 판단"
- [ ] **계정 없이 사용 가능** (핵심!)
- [ ] 데모용 API 엔드포인트 (`/api/demo/answer`)

**의존성:** Issue #L1

---

### Issue #L5: `[Frontend] 핵심 기능 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:high`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 기능 1: 장수/높이 자동 계산 엔진
- [ ] 기능 2: 브랜드 톤 복제
- [ ] 기능 3: 정책 문서 기반 정확한 답변 (File Search)
- [ ] 기능 4: 반자동 구조로 안전
- [ ] 기능 5: 문의 분석 리포트 (Pro)
- [ ] 각 기능별 아이콘 + 한 문장 가치 + 설명
- [ ] 카드 또는 탭 형태 UI

**의존성:** Issue #L1

---

### Issue #L6: `[Frontend] 가치/ROI 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:medium`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 헤드라인: "AI 상담사 1명이 월 59,000원."
- [ ] ROI 계산 시각화
  - 하루 30건 기준 → 60~120분 절약
  - 월 20~40시간 절약
- [ ] 그래프 또는 인포그래픽
- [ ] 비용 비교 (CS 인력 vs AI)

**의존성:** Issue #L1

---

### Issue #L7: `[Frontend] 후기/Testimonials 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:medium`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 후기 카드 2~3개
  - "이제 문의가 무섭지 않아요." - 데코지오 대표님
  - "장수 계산이 정확해서 실수 없어요." - OO커튼
- [ ] 프로필 이미지 (또는 아바타)
- [ ] 별점 또는 신뢰 배지
- [ ] 캐러셀 또는 그리드 레이아웃

**의존성:** Issue #L1

---

### Issue #L8: `[Frontend] 가격 플랜 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:high`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] Basic 플랜 카드 (59,000원/월)
  - 하루 10~30건 처리
  - 장수 자동 계산
  - 브랜드 톤 반영
  - File Search 문서 1개
  - 월 1,000건 생성
- [ ] Pro 플랜 카드 (109,000원/월) - **강조**
  - 하루 30~80건 처리
  - 이미지 → 텍스트 파싱
  - File Search 문서 5개
  - Q&A 분석 리포트
  - 월 3,000건 생성
- [ ] "7일 무료 체험" 배지
- [ ] CTA 버튼 각 플랜에 포함

**의존성:** Issue #L1

---

### Issue #L9: `[Frontend] FAQ 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:medium`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] 아코디언 UI
- [ ] FAQ 항목 6개
  - AI 답변 정확도가 얼마나 되나요?
  - 오늘의집에 자동으로 답변 올려주나요?
  - 문서 업로드가 어렵진 않나요?
  - 우리 브랜드만의 규칙도 반영되나요?
  - 계약기간 제한이 있나요?
  - 무료 체험은 어떻게 작동하나요?
- [ ] 펼침/접힘 애니메이션

**의존성:** Issue #L1

---

### Issue #L10: `[Frontend] CTA + Footer 섹션 구현`

**labels:** `type:feature`, `area:frontend`, `priority:medium`

**상태:** ⬜ 미완료

#### 완료 조건
- [ ] CTA 섹션
  - 헤드라인: "지금 문의 하나만 복붙해봐. AI가 대신 답해줄게."
  - 버튼: "7일 무료 시작하기" / "데모 바로 해보기"
- [ ] Footer
  - 제작자 소개 (병우/병스커)
  - 연락처
  - 브랜드 문의
  - 개인정보처리방침
- [ ] 소셜 링크 (선택)

**의존성:** Issue #L1

---

## 이슈 의존성 다이어그램

```
┌─────────────────────────────────────────┐
│  #L1 프로젝트 초기 설정                   │
└─────────────────────────────────────────┘
                    │
    ┌───────┬───────┼───────┬───────┬───────┐
    ▼       ▼       ▼       ▼       ▼       ▼
  #L2     #L3     #L4     #L5     #L6     #L7
  Hero   Before  Demo    기능    ROI     후기
         After   ⭐핵심
    │       │       │       │       │       │
    └───────┴───────┴───────┴───────┴───────┘
                    │
            ┌───────┼───────┐
            ▼       ▼       ▼
          #L8     #L9     #L10
          가격    FAQ    CTA+Footer
```

---

## 실행 순서 요약

| 순서 | 이슈 | 작업 | 예상 소요 | 상태 |
|------|------|------|-----------|------|
| 1 | #L1 | 프로젝트 초기 설정 | 1시간 | ⬜ |
| 2 | #L2 | Hero 섹션 | 2시간 | ⬜ |
| 3 | #L4 | **데모 섹션 (핵심)** | 3시간 | ⬜ |
| 4 | #L3 | Before/After 섹션 | 1시간 | ⬜ |
| 5 | #L5 | 핵심 기능 섹션 | 1.5시간 | ⬜ |
| 6 | #L8 | 가격 플랜 섹션 | 1시간 | ⬜ |
| 7 | #L6, #L7 | ROI + 후기 (병렬) | 1.5시간 | ⬜ |
| 8 | #L9, #L10 | FAQ + CTA/Footer | 1시간 | ⬜ |

**총 예상 소요 시간**: 약 12시간 (하루 3시간 × 4일)

---

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Font**: Pretendard / Noto Sans KR
- **Animation**: Framer Motion (선택)
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 완료 기록

| 날짜 | 완료 이슈 | 메모 |
|------|-----------|------|
| 2024-11-24 | #L1 | Next.js 16 + Tailwind + Noto Sans KR 설정 완료 |
| 2024-11-24 | #L2 | Hero 섹션 (헤드라인, CTA 버튼, 데모 애니메이션) 완료 |
| 2024-11-24 | #L4 | 데모 섹션 (문의 입력, AI 답변 생성, 복사 기능) 완료 |
| 2024-11-24 | #L3 | Before/After 섹션 (비교 카드, 아이콘) 완료 |
| 2024-11-24 | #L5 | 핵심 기능 섹션 (5가지 기능 카드) 완료 |
| 2024-11-24 | #L8 | 가격 플랜 섹션 (Basic/Pro 플랜 카드) 완료 |
| 2024-11-24 | #L6 | 가치/ROI 섹션 (통계, 비용 비교) 완료 |
| 2024-11-24 | #L7 | 후기 섹션 (테스티모니얼 카드, 신뢰 배지) 완료 |
| 2024-11-24 | #L9 | FAQ 섹션 (아코디언 UI, 6개 질문) 완료 |
| 2024-11-24 | #L10 | CTA + Footer 섹션 (최종 전환 유도, 푸터) 완료 |
