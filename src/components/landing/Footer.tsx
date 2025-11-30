import { Mail, MessageCircle } from "lucide-react";

const footerLinks = {
  product: [
    { label: "기능 소개", href: "#features" },
    { label: "가격 플랜", href: "#pricing" },
    { label: "데모", href: "#demo" },
    { label: "FAQ", href: "#faq" },
  ],
  support: [
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
    { label: "문의하기", href: "mailto:support@example.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 상단 영역 */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 브랜드 정보 */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">
              AI 상담 에이전트
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              오늘의집 판매자를 위한 AI 상담 솔루션.
              <br />
              브랜드 톤과 정책을 그대로 반영한 답변을 5초 안에 생성합니다.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:support@example.com"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 제품 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">제품</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">지원</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 저작권 */}
            <p className="text-gray-500 text-sm">
              © 2024 AI 상담 에이전트. All rights reserved.
            </p>

            {/* 제작자 정보 */}
            <p className="text-gray-500 text-sm">
              Made with ❤️ by{" "}
              <span className="text-gray-400 font-medium">병우/병스커</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
