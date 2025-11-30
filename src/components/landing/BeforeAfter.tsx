import { X, Check, Clock, AlertTriangle, Brain, Zap, Heart, Timer } from "lucide-react";

const beforeItems = [
  { icon: Clock, text: "고객 문의 30~60건 반복 처리" },
  { icon: AlertTriangle, text: "매번 장수/높이 계산해야 함" },
  { icon: X, text: "오답 위험, 실수로 인한 반품" },
  { icon: Timer, text: "퇴근 후에도 문의가 계속 쌓임" },
];

const afterItems = [
  { icon: Zap, text: "문의 복붙 → 5초 안에 답변 생성" },
  { icon: Brain, text: "브랜드 정책 기반 장수 자동 계산" },
  { icon: Heart, text: "고객 톤 그대로 유지" },
  { icon: Check, text: "하루 최소 1~3시간 절약" },
];

export default function BeforeAfter() {
  return (
    <section id="before-after" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            CS 업무, 이렇게 달라져요
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            AI 상담 에이전트 도입 전후를 비교해보세요.
          </p>
        </div>

        {/* Before / After 카드 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Before */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              BEFORE
            </div>
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-100 h-full">
              <h3 className="text-xl font-bold text-red-800 mb-6">기존 방식</h3>
              <ul className="space-y-4">
                {beforeItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700 pt-1">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-red-200">
                <p className="text-red-700 font-medium">
                  😰 매일 2~3시간 CS에 소비
                </p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
              AFTER
            </div>
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-100 h-full">
              <h3 className="text-xl font-bold text-green-800 mb-6">AI 상담사 사용</h3>
              <ul className="space-y-4">
                {afterItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 pt-1">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-green-200">
                <p className="text-green-700 font-medium">
                  😊 CS 시간 70% 이상 절감
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 화살표 */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-20 bg-gray-300" />
            <span className="text-gray-400 font-medium">→</span>
            <span className="text-blue-600 font-bold">변화의 시작</span>
            <span className="text-gray-400 font-medium">→</span>
            <div className="h-px w-20 bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
