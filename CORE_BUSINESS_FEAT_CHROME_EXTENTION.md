# 오늘의집 CS 자동화를 위한 크롬 익스텐션 아이디어

본 문서는 **오늘의집 셀러 페이지에 직접 연동되는 크롬 익스텐션**을 통해

> 고객 문의 → AI 답변 생성 → 자동 입력

까지를 **브라우저 레벨에서 반자동으로 처리**하기 위한 설계 아이디어를 정리한다.

---

## 1. 왜 크롬 익스텐션인가

오늘의집은 공식 API를 제공하지 않지만:

- 셀러는 브라우저에서 직접 CS 작업을 수행
- 브라우저 확장은 **사용자 세션을 그대로 활용 가능**
- 서버 크롤링 대비 법·약관 리스크 낮음

👉 크롬 익스텐션은 **API 없는 플랫폼 자동화의 표준 해법**이다.

---

## 2. 핵심 컨셉

> "오늘의집 페이지 위에 AI 비서 하나를 얹는다"

- 오늘의집 서버는 그대로 둔다
- 셀러의 클릭/입력만 보조한다
- 모든 최종 행동은 사람이 한다

---

## 3. 기본 사용자 플로우

1. 셀러가 오늘의집 판매자센터 로그인
2. Q&A / 문의 관리 페이지 진입
3. 각 문의 카드 옆에 **[AI 답변 생성] 버튼 노출**
4. 버튼 클릭
5. 문의 텍스트 자동 추출
6. SaaS API로 전달
7. AI 답변 수신
8. 답변 textarea에 자동 입력
9. 셀러가 검토 후 등록

---

## 4. 기술 아키텍처

```
[오늘의집 Q&A 페이지]
   ↑ (DOM 접근)
[Chrome Extension Content Script]
   ↓
[Background Script]
   ↓
[너의 SaaS API]
   ↓
[AI 답변]
   ↓
[Content Script → textarea 자동 입력]
```

---

## 5. 핵심 기능 설계

### 5-1. 문의 텍스트 추출

- DOM에서 다음 요소 탐색:
  - 고객 문의 본문
  - 상품명 (선택)

```ts
const questionText = document.querySelector('.qna-question')?.innerText;
```

> DOM 구조 변경 가능성을 고려해 **querySelector는 최소화**

---

### 5-2. AI 버튼 주입

- 각 문의 카드에 버튼 삽입

```ts
const btn = document.createElement('button');
btn.innerText = 'AI 답변 생성';
btn.onclick = handleGenerate;
```

---

### 5-3. SaaS API 연동

```ts
POST /api/brands/{brandId}/answer
{
  question: questionText
}
```

- 인증은 API Key 또는 OAuth Token 사용
- 브랜드 선택은 익스텐션 설정 페이지에서 수행

---

### 5-4. 답변 자동 입력

```ts
const textarea = document.querySelector('textarea.answer');
textarea.value = aiAnswer;
textarea.dispatchEvent(new Event('input'));
```

> ⚠️ 실제 input 이벤트를 발생시켜야 오늘의집이 값 변경을 인식함

---

## 6. UX 설계 포인트 (중요)

- 자동 입력 후 **하이라이트 표시**
- "자동 생성됨" 배지 표시
- 실패 시 수동 복사 버튼 제공

---

## 7. 보안 및 안정성 설계

- 로그인 정보 수집 ❌
- 오늘의집 API 호출 ❌
- DOM 조작만 수행 ⭕️

익스텐션은:
- 텍스트 읽기
- 텍스트 쓰기

이 두 가지만 한다.

---

## 8. MVP 범위 정의

### 반드시 포함

- 문의 텍스트 자동 추출
- AI 답변 생성 버튼
- 답변 textarea 자동 입력

### 나중에 추가

- 문의 유형 자동 분류
- Slack 알림과 연결
- 답변 히스토리 표시

---

## 9. 이 접근의 전략적 의미

- 셀러 입장: "이거 없으면 다시는 못 쓰겠다"
- 너의 SaaS 입장: 플랫폼 종속 없이 확장 가능
- 투자/세일즈 관점: **실질적인 자동화 증명 포인트**

---

## 10. 결론

크롬 익스텐션은
- MVP 이후 바로 전환율을 끌어올리는 기능이며
- 오늘의집 API 부재 문제를 가장 안전하게 우회하는 방법이다.

이 익스텐션은 **기능이 아니라 전략**이다.

