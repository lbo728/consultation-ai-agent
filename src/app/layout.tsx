import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI 상담사 | 오늘의집 판매자를 위한 CS 자동화",
  description: "오늘의집 문의, 이제 AI가 5초 안에 대신 답해줄게. 브랜드 가이드·톤까지 그대로 따라가는 전용 AI 상담사.",
  keywords: ["오늘의집", "AI 상담", "CS 자동화", "커튼", "판매자", "SaaS"],
  openGraph: {
    title: "AI 상담사 | 오늘의집 판매자를 위한 CS 자동화",
    description: "오늘의집 문의, 이제 AI가 5초 안에 대신 답해줄게.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
