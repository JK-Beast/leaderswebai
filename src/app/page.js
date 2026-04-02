import TeamLandingPage from "./_components/TeamLandingPage";

const CHUNGNAM_KAKAO = "https://open.kakao.com/o/gYmKTXni"; // 충남팀 단톡방
const COMPANY_KAKAO  = "http://pf.kakao.com/_fLvwT/friend";  // 카카오 비즈니스 채널

const config = {
  teamName: "LEADERS AI LABS",
  regionText: "충남",
  heroBadge: "2025 · AI 교육 전문 · 1기 모집중",
  status: "open",
  seatTotal: 100,
  seatFilled: 0,
  address: "충청남도 천안시 동남구 일대",
  kakaoUrl: CHUNGNAM_KAKAO,
  teams: [
    {
      name: "대전팀 1기",
      region: "대전광역시 일대",
      status: "closed",
      statusLabel: "마감 · 74명",
      seatTotal: 74,
      seatFilled: 74,
      kakaoUrl: COMPANY_KAKAO,
      href: "/daejeon",
    },
    {
      name: "충남팀 1기",
      region: "천안 · 충남 지역",
      status: "open",
      statusLabel: "모집중",
      seatTotal: 100,
      seatFilled: 0,
      kakaoUrl: CHUNGNAM_KAKAO,
      href: "/chungnam",
    },
  ],
};

export default function HomePage() {
  return <TeamLandingPage config={config} />;
}
