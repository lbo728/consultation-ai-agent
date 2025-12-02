import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          지금 바로 시작하세요
        </div>

        {/* 헤드라인 */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          지금 문의 하나만 복붙해봐.
          <br />
          <span className="text-blue-200">AI가 대신 답해줄게.</span>
        </h2>

        {/* 서브 텍스트 */}
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          하루 30건 이상 반복되는 문의, 이제 AI에게 맡기세요.
          <br />
          7일 무료 체험으로 직접 경험해보세요.
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl shadow-black/20"
          >
            7일 무료 시작하기
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors"
          >
            데모 바로 해보기
          </a>
        </div>

        {/* 추가 안내 */}
        <p className="mt-8 text-blue-200 text-sm">
          카드 등록 없이 시작 가능 · 언제든 취소 가능
        </p>
      </div>
    </section>
  );
}
