import { Clock, TrendingUp, DollarSign, Users } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "60~120분",
    label: "하루 절약 시간",
    subtext: "30건 기준",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: TrendingUp,
    value: "20~40시간",
    label: "월 절약 시간",
    subtext: "업무일 기준",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: DollarSign,
    value: "70%+",
    label: "CS 시간 절감",
    subtext: "평균 효율",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Users,
    value: "5초",
    label: "답변 생성 시간",
    subtext: "AI 처리",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function ROI() {
  return (
    <section id="roi" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI 상담사 1명이
            <br />
            <span className="text-blue-600">월 59,000원.</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            CS 직원 채용 비용의 1/50, 하지만 24시간 대기 가능.
            <br />
            투자 대비 효과를 숫자로 확인하세요.
          </p>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium mb-1">{stat.label}</div>
              <div className="text-gray-500 text-sm">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* 비용 비교 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">
            비용 비교: CS 인력 vs AI 상담사
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* CS 인력 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">CS 파트타임</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>월 인건비</span>
                  <span className="font-semibold text-gray-900">약 150~200만원</span>
                </li>
                <li className="flex justify-between">
                  <span>근무 시간</span>
                  <span className="font-semibold text-gray-900">8시간/일</span>
                </li>
                <li className="flex justify-between">
                  <span>처리 속도</span>
                  <span className="font-semibold text-gray-900">2~5분/건</span>
                </li>
                <li className="flex justify-between">
                  <span>휴일/야간</span>
                  <span className="font-semibold text-red-600">불가</span>
                </li>
              </ul>
            </div>

            {/* AI 상담사 */}
            <div className="bg-white rounded-xl p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  추천
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">AI 상담 에이전트</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>월 비용</span>
                  <span className="font-semibold text-blue-600">59,000원~</span>
                </li>
                <li className="flex justify-between">
                  <span>가용 시간</span>
                  <span className="font-semibold text-gray-900">24시간</span>
                </li>
                <li className="flex justify-between">
                  <span>처리 속도</span>
                  <span className="font-semibold text-green-600">5초/건</span>
                </li>
                <li className="flex justify-between">
                  <span>휴일/야간</span>
                  <span className="font-semibold text-green-600">가능</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 결론 */}
          <div className="mt-8 text-center">
            <p className="text-gray-700 font-medium">
              <span className="text-blue-600 font-bold">1/30 비용</span>으로{" "}
              <span className="text-blue-600 font-bold">24배 더 오래</span> 일하는
              AI 상담사를 만나보세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
