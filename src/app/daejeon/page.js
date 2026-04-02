import TeamLandingPage from "../_components/TeamLandingPage";

const config = {
  teamName: "대전",
  regionText: "대전",
  heroBadge: "대전 1기 · 모집 마감",
  status: "closed",
  seatTotal: 74,
  seatFilled: 74,
  address: "대전광역시 중구 대종로 417-1번지",
  kakaoUrl: "http://pf.kakao.com/_fLvwT/friend", // 카카오 비즈니스 채널
};

export default function DaejeonPage() {
  return <TeamLandingPage config={config} />;
}
