import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://risegen.kr"),
  title: "리더스 AI 랩 (LEADERS AI LABS) — 1기 모집",
  description: "대전 최초 AI 실무 커뮤니티. Gemini + Workflow 기반 AI 실무 교육 1기 선착순 모집.",
  openGraph: {
    title: "리더스 AI 랩 — 1기 멤버 모집",
    description: "대전 한정 1기 100명 선착순 모집. 당신의 업무를 AI로 혁신하세요.",
    url: "https://risegen.kr",
    siteName: "리더스 AI 랩",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "LEADERS AI LABS 1기 모집",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
