"use client";

import { useState, useEffect } from "react";
import { Zap, Users, Calculator, Ruler } from "lucide-react";

const badges = [
  { icon: Zap, text: "단 5초", color: "bg-yellow-100 text-yellow-800" },
  { icon: Users, text: "브랜드 전용", color: "bg-blue-100 text-blue-800" },
  { icon: Calculator, text: "자동 장수 계산", color: "bg-green-100 text-green-800" },
  { icon: Ruler, text: "이음선 자동 안내", color: "bg-purple-100 text-purple-800" },
];

const demoMessages = [
  {
    question: "가로 215cm, 세로 240cm인데 몇 장 주문해야 하나요?",
    answer:
      "안녕하세요, 맞춤제작 커튼 전문업체 데코지오입니다. 😊\n\n고객님의 창문 사이즈(가로 215cm)를 기준으로 계산해드릴게요.\n\n✔ 추천 구성: 350폭 1장\n✔ 예상 높이: 241cm (실측 + 1cm)\n✔ 이음선 여부: 없음\n\n추가 문의 있으시면 편하게 말씀해주세요!",
  },
  {
    question: "이음선 생기면 어떻게 되나요?",
    answer:
      "안녕하세요, 데코지오입니다. 😊\n\n이음선은 커튼 원단을 연결할 때 생기는 봉제선이에요.\n\n✔ 3장 이상 구성 시 이음선 발생\n✔ 실제 사용 시 거의 눈에 띄지 않아요\n✔ 자연스러운 주름에 가려집니다\n\n걱정 마시고 주문해주세요!",
  },
];

export default function Hero() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAnswer(false);
      setTimeout(() => {
        setCurrentDemo((prev) => (prev + 1) % demoMessages.length);
        setTimeout(() => setShowAnswer(true), 500);
      }, 300);
    }, 6000);

    // 초기 답변 표시
    const initialTimeout = setTimeout(() => setShowAnswer(true), 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          {/* 배지 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.color}`}
              >
                <badge.icon className="w-4 h-4" />
                {badge.text}
              </span>
            ))}
          </div>

          {/* 헤드라인 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            오늘의집 문의,
            <br />
            <span className="text-blue-600">이제 AI가 5초 안에</span>
            <br />
            대신 답해줄게.
          </h1>

          {/* 서브 헤드라인 */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            브랜드 가이드·톤까지 그대로 따라가는 전용 AI 상담사.
            <br />
            하루 30건 이상 반복 문의, 이제 복붙만 하면 끝.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              👉 7일 무료로 시작하기
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              👉 문의 붙여넣고 데모 보기
            </a>
          </div>
        </div>

        {/* 데모 애니메이션 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* 헤더 */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-sm text-gray-500">AI 상담 에이전트</span>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 문의 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">고객 문의</label>
                  <div className="bg-gray-50 rounded-xl p-4 h-[180px] overflow-auto border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{demoMessages[currentDemo].question}</p>
                  </div>
                </div>

                {/* AI 답변 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI 답변 <span className="text-blue-600">(3초 생성)</span>
                  </label>
                  <div
                    className={`bg-blue-50 rounded-xl p-4 h-[180px] overflow-auto border border-blue-100 transition-all duration-500 ${
                      showAnswer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">{demoMessages[currentDemo].answer}</p>
                  </div>
                </div>
              </div>

              {/* 부가 정보 */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  ✓ 브랜드 톤 자동 적용
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  ✓ 장수 계산 자동 판단
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  ✓ 이음선 여부 자동 안내
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
