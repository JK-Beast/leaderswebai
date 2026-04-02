import TeamLandingPage from "../_components/TeamLandingPage";

const config = {
  applyMode: true,
  teamName: "충남",
  regionText: "충남",
  heroBadge: "충남 한정 · 1기 100명 선착순",
  status: "open",
  seatTotal: 100,
  seatFilled: 0,
  address: "충청남도 천안시 동남구 일대",
  kakaoUrl: "https://open.kakao.com/o/gYmKTXni", // 충남팀 단톡방
};

export default function ChungnamPage() {
  return <TeamLandingPage config={config} />;
}
