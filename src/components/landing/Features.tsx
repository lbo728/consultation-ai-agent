import { Calculator, Users, FileSearch, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "장수/높이 자동 계산 엔진",
    description: "가로/세로/스타일을 넣으면 규칙 엔진이 자동 계산. 140/280/350 단위 조합, 이음선 여부까지 자동 판단.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "브랜드 톤 복제",
    description: "인사말/마무리/문체를 너가 올린 문서 그대로 반영. \"사장님이 말하는 톤 그대로\" 답변 생성.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: FileSearch,
    title: "정책 문서 기반 정확한 답변",
    description: "브랜드의 가이드, Q&A 문서 자동 청크 → RAG 구동. 고객이 뭐라고 물어도 브랜드 문서를 근거로 답변.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    title: "반자동 구조로 안전",
    description: "AI가 답변을 초안 생성 → 판매자가 검토 후 오늘의집에 붙여넣기. 완전 자동이 아니라 오답 리스크 없음.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: BarChart3,
    title: "문의 분석 리포트",
    badge: "Pro",
    description: "\"지난 7일 문의 패턴\" 자동 분석. 치수 문의%, 설치 문의%, 재질 문의%로 인사이트 제공.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            핵심 기능
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            AI 상담 에이전트가 제공하는 강력한 기능들
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                {feature.badge && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                    {feature.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
