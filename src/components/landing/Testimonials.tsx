import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "이제 문의가 무섭지 않아요. 하루 50건씩 오던 문의도 AI가 초안 만들어주니까 검토만 하면 끝!",
    author: "김OO 대표님",
    company: "데코지오",
    role: "맞춤커튼 전문",
    avatar: "D",
    rating: 5,
  },
  {
    quote: "장수 계산이 정확해서 실수가 없어요. 예전엔 계산 실수로 반품도 있었는데, 이제는 걱정 없습니다.",
    author: "이OO 대표님",
    company: "홈스타일커튼",
    role: "인테리어 패브릭",
    avatar: "H",
    rating: 5,
  },
  {
    quote: "퇴근 후에도 문의 답변 걱정하던 게 사라졌어요. AI가 대신 답변 초안 만들어주니까 아침에 확인만 하면 돼요.",
    author: "박OO 대표님",
    company: "리빙앤홈",
    role: "홈 인테리어",
    avatar: "L",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            먼저 사용해본 분들의 이야기
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            실제 오늘의집 판매자분들이 경험한 변화입니다.
          </p>
        </div>

        {/* 후기 카드 */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* 인용 아이콘 */}
              <div className="absolute -top-4 left-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* 별점 */}
              <div className="flex gap-1 mb-4 pt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* 후기 내용 */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* 작성자 정보 */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.company} · {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 신뢰 배지 */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <span className="text-green-600 font-bold">98%</span>
            <span className="text-gray-600 text-sm">고객 만족도</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <span className="text-blue-600 font-bold">50+</span>
            <span className="text-gray-600 text-sm">베타 테스터</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <span className="text-purple-600 font-bold">10,000+</span>
            <span className="text-gray-600 text-sm">생성된 답변</span>
          </div>
        </div>
      </div>
    </section>
  );
}
