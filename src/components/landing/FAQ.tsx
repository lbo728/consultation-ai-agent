"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "AI 답변 정확도가 얼마나 되나요?",
    answer:
      "브랜드 문서와 규칙 엔진을 기반으로 답변을 생성하기 때문에, 업로드하신 정책 문서 내용에 대해서는 95% 이상의 정확도를 보입니다. 또한 반자동 구조로 판매자님이 최종 검토 후 답변을 전송하기 때문에 오답 리스크가 최소화됩니다.",
  },
  {
    question: "오늘의집에 자동으로 답변을 올려주나요?",
    answer:
      "아니요, 완전 자동 게시는 지원하지 않습니다. AI가 생성한 답변을 판매자님이 검토한 뒤, 복사하여 오늘의집에 직접 붙여넣는 반자동 방식입니다. 이렇게 하면 AI 오답으로 인한 고객 불만이나 브랜드 이미지 손상을 방지할 수 있습니다.",
  },
  {
    question: "문서 업로드가 어렵진 않나요?",
    answer:
      "전혀 어렵지 않습니다. PDF, Word, 텍스트 파일을 드래그앤드롭으로 업로드하면 됩니다. 기존에 사용하시던 Q&A 매뉴얼, 제품 스펙 문서, 고객 응대 가이드 등을 그대로 올려주시면 AI가 자동으로 학습합니다.",
  },
  {
    question: "우리 브랜드만의 규칙도 반영되나요?",
    answer:
      "네, 그게 저희 서비스의 핵심입니다. 장수 계산 규칙, 이음선 기준, 레일 깊이 조건 등 브랜드별 고유 규칙을 설정할 수 있고, AI가 이 규칙을 정확히 따라 답변을 생성합니다. 인사말과 마무리 톤도 브랜드에 맞게 설정 가능합니다.",
  },
  {
    question: "계약기간 제한이 있나요?",
    answer:
      "월 구독 방식으로 언제든 해지가 가능합니다. 최소 계약 기간이 없으며, 매월 자동 결제됩니다. 해지를 원하시면 결제일 전에 취소하시면 다음 달부터 결제되지 않습니다.",
  },
  {
    question: "무료 체험은 어떻게 작동하나요?",
    answer:
      "가입 후 7일간 모든 기능을 무료로 사용할 수 있습니다. 카드 등록 없이 체험이 가능하며, 7일 후 유료 전환 여부를 선택하시면 됩니다. 체험 기간 동안 생성한 답변 수에 제한이 없습니다.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            자주 묻는 질문
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            궁금한 점이 있으신가요?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            자주 묻는 질문들을 모았습니다. 더 궁금한 점은 언제든 문의해주세요.
          </p>
        </div>

        {/* FAQ 아코디언 */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 문의 안내 */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            원하는 답변을 찾지 못하셨나요?
          </p>
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-blue-600 text-white font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-blue-700 dark:shadow-blue-500/20 transition-colors"
          >
            직접 문의하기
          </a>
        </div>
      </div>
    </section>
  );
}
