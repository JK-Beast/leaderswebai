import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://risegen.kr"),
  title: "LEADERS AI LABS — 1기 모집",
  description: "대전 한정 1기 100명 선착순 모집. Gemini + Workflow 기반 AI 실무 교육.",
  openGraph: {
    title: "RiseGen - 새로운 세대를 위한 AI 솔루션",
    description: "RiseGen의 혁신적인 맞춤형 AI 서비스를 지금 만나보세요.",
    url: "https://risegen.kr",
    images: [
      {
        url: "https://risegen.kr/images/thumbnail.png",
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
