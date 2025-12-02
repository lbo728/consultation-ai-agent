import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "59,000",
    description: "하루 10~30건 문의 처리",
    badge: null,
    features: [
      "하루 10~30건 처리",
      "장수 자동 계산",
      "브랜드 톤 반영",
      "File Search 문서 1개",
      "월 1,000건 생성",
      "이메일 지원",
    ],
    cta: "Basic 시작하기",
    ctaStyle: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "109,000",
    description: "하루 30~80건 문의 처리",
    badge: "인기",
    features: [
      "하루 30~80건 처리",
      "이미지 → 텍스트 파싱",
      "File Search 문서 5개",
      "Q&A 분석 리포트",
      "월 3,000건 생성",
      "우선 지원 + 카카오톡",
    ],
    cta: "Pro 시작하기",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-700",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            7일 무료 체험
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            심플한 가격, 확실한 가치
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            부담 없이 시작하고, 효과를 확인한 뒤 결정하세요.
            <br />
            모든 플랜에 7일 무료 체험이 포함됩니다.
          </p>
        </div>

        {/* 가격 카드 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? "border-2 border-blue-600 shadow-xl shadow-blue-600/10"
                  : "border border-gray-200 shadow-lg"
              }`}
            >
              {/* 인기 배지 */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* 플랜 정보 */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ₩{plan.price}
                  </span>
                  <span className="text-gray-500">/월</span>
                </div>
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA 버튼 */}
              <a
                href="#"
                className={`block w-full py-4 text-center font-semibold rounded-xl transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>

              {/* 무료 체험 안내 */}
              <p className="text-center text-sm text-gray-500 mt-4">
                7일 무료 체험 포함
              </p>
            </div>
          ))}
        </div>

        {/* 추가 안내 */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            대량 문의 처리가 필요하신가요?{" "}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Enterprise 플랜 문의하기
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
