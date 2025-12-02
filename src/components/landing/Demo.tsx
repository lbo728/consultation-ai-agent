"use client";

import { useState } from "react";
import { Send, Copy, Check, Loader2, Sparkles } from "lucide-react";

// 데모용 샘플 응답 (실제 API 연동 전)
const generateDemoAnswer = (question: string): string => {
  // 치수 관련 키워드 체크
  const hasSize = /\d+/.test(question);
  const hasSeam = question.includes("이음선") || question.includes("연결");
  const hasRail = question.includes("레일") || question.includes("박스");

  if (hasSize) {
    return `안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊

고객님께서 문의해주신 내용을 확인했습니다.

✔ 추천 구성: 고객님의 창문 사이즈를 기준으로 최적의 조합을 계산했어요
✔ 예상 높이: 실측에 맞춰 제작됩니다
✔ 이음선 여부: 사이즈에 따라 자동 계산됩니다

정확한 치수를 입력해주시면 더 상세한 안내가 가능합니다!
추가 문의 있으시면 편하게 말씀해주세요 💕`;
  }

  if (hasSeam) {
    return `안녕하세요, 데코지오입니다. 😊

이음선 관련 문의 감사합니다!

✔ 이음선은 커튼 원단을 연결할 때 생기는 봉제선이에요
✔ 3장 이상 구성 시 이음선이 발생할 수 있어요
✔ 실제 사용 시 자연스러운 주름에 가려져 거의 눈에 띄지 않습니다

이음선이 걱정되시면 상담을 통해 최적의 구성을 안내해드릴게요!`;
  }

  if (hasRail) {
    return `안녕하세요, 데코지오입니다. 😊

레일/박스 관련 문의 주셨네요!

✔ 박스 깊이에 따라 적합한 레일을 추천해드려요
✔ 일반적으로 10cm 이상의 깊이가 있으면 설치가 가능합니다
✔ 정확한 박스 깊이를 알려주시면 맞춤 안내해드릴게요

설치 관련 추가 문의도 환영합니다! 💕`;
  }

  return `안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊

문의해주신 내용 확인했습니다.

저희 데코지오는 고객님의 창문에 딱 맞는 맞춤 커튼을 제작해드리고 있어요.

✔ 정확한 치수 측정 방법 안내
✔ 원단/색상 선택 도움
✔ 설치 방법 상담

더 자세한 상담이 필요하시면 편하게 말씀해주세요!
감사합니다 💕`;
};

export default function Demo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");

    // 실제 API 호출 시뮬레이션 (3초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const demoAnswer = generateDemoAnswer(question);
    setAnswer(demoAnswer);
    setIsLoading(false);
  };

  const handleCopy = async () => {
    if (!answer) return;

    await navigator.clipboard.writeText(answer);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            계정 없이 바로 체험
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            고객 문의 하나 붙여넣어보면
            <br />
            <span className="text-blue-600">바로 이해돼.</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            실제 오늘의집 Q&A에서 받은 문의를 붙여넣어보세요.
            <br />
            AI가 브랜드 톤에 맞춘 답변을 3초 안에 생성합니다.
          </p>
        </div>

        {/* 데모 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-sm text-gray-500 font-medium">
                  AI 상담 에이전트 - 데모
                </span>
              </div>
              <span className="text-xs text-gray-400">데코지오 브랜드</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* 문의 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                고객 문의 입력
              </label>
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="오늘의집 Q&A에서 복사한 문의 내용을 붙여넣으세요...

예시: 가로 215cm, 세로 240cm인데 몇 장 주문해야 하나요? 이음선 생기나요?"
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!question.trim() || isLoading}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-medium">
                    AI가 브랜드 톤에 맞춰 답변을 생성하고 있어요...
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    규칙 엔진 계산 중
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    정책 문서 검색 중
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    답변 생성 중
                  </span>
                </div>
              </div>
            )}

            {/* AI 답변 */}
            {answer && !isLoading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    AI 생성 답변
                  </label>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        복사하기
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {answer}
                  </p>
                </div>
              </div>
            )}

            {/* 부가 정보 */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-gray-100">
              <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ 브랜드 톤 자동 적용됨
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                ✓ 장수 계산 / 이음선 여부 자동 판단
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                ✓ 레일·박스 깊이 기반 안내 포함
              </span>
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            더 정확한 답변을 원하시나요? 브랜드 문서를 업로드하고 맞춤형 AI를 만들어보세요.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            7일 무료 체험 시작하기
          </a>
        </div>
      </div>
    </section>
  );
}
