"use client";
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";

/* ── 팀 Config Context ─────────────────────────────────────────── */
const TeamCtx = createContext({});
const useCfg = () => useContext(TeamCtx);

/* ═══════════════════════════════════════════════════════════════
   LEADERS AI LABS — 1기 모집 랜딩페이지
   Mobile-First · Interactive · Future-Focused
   ═══════════════════════════════════════════════════════════════ */

// ═══ HOOKS ═══
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold: 0.15, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "", y = 30, x = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0,0)" : `translate(${x}px,${y}px)`,
      transition: `opacity 0.7s cubic-bezier(.2,.8,.2,1) ${delay}s, transform 0.7s cubic-bezier(.2,.8,.2,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ═══ AMBIENT GLOW ═══
function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div className="absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400 opacity-[0.12] blur-[100px]" style={{ animation: "float 18s ease-in-out infinite" }} />
      <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-400 opacity-[0.10] blur-[90px]" style={{ animation: "float 22s ease-in-out infinite reverse" }} />
      <div className="absolute -bottom-[15%] left-[15%] w-[60vw] h-[60vw] max-w-[550px] max-h-[550px] rounded-full bg-violet-400 opacity-[0.08] blur-[110px]" style={{ animation: "float 25s ease-in-out infinite 3s" }} />
    </div>
  );
}

// ═══ SEAT PROGRESS BAR ═══
function SeatBar({ total, filled, className = "" }) {
  const [ref, inView] = useInView();
  const pct = (filled / total) * 100;
  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs sm:text-sm font-bold text-slate-500 tracking-wide">모집 현황</span>
        <span className="text-sm sm:text-base font-black text-blue-600">{filled}<span className="text-slate-400 font-semibold text-xs sm:text-sm">/{total}명</span></span>
      </div>
      <div className="h-3 sm:h-3.5 rounded-full overflow-hidden bg-slate-100 border border-slate-200/50">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 relative"
          style={{ width: inView ? `${pct}%` : "0%", transition: "width 2s cubic-bezier(.16,1,.3,1) 0.3s" }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "shimmer 2s infinite" }} />
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400 font-medium text-right">잔여 <strong className="text-rose-500">{total - filled}석</strong></p>
    </div>
  );
}

// ═══ MAGNETIC BUTTON ═══
function MagBtn({ children, href, onClick, variant = "primary", size = "md", className = "", type = "button" }) {
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const onMove = (e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setOff({ x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.12 }); };
  const onLeave = () => setOff({ x: 0, y: 0 });

  const styles = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 border border-white/10",
    kakao: "bg-[#FEE500] text-[#3C1E1E] shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/35",
  };
  const sizes = {
    sm: "px-5 py-2.5 text-sm rounded-xl",
    md: "px-6 py-3.5 text-[15px] rounded-2xl",
    lg: "px-8 py-4 text-base sm:text-lg rounded-2xl",
  };
  const cls = `group relative inline-flex items-center justify-center gap-2.5 font-bold tracking-wide transition-all duration-300 active:scale-95 ${styles[variant]} ${sizes[size]} ${className}`;
  const st = { transform: `translate(${off.x}px, ${off.y}px)`, transition: "transform 0.2s ease-out, box-shadow 0.3s" };

  if (href) return <a ref={ref} href={href} target={href.startsWith("#") ? "_self" : "_blank"} rel="noopener noreferrer" onMouseMove={onMove} onMouseLeave={onLeave} className={cls} style={st}>{children}</a>;
  return <button ref={ref} type={type} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} className={cls} style={st}>{children}</button>;
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — Mobile-first, future-focused
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const cfg = useCfg();
  const isClosed = cfg.status === "closed";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mk = (d) => ({ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: `all 0.8s cubic-bezier(.2,.8,.2,1) ${d}s` });

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-5 sm:px-6 pt-24 pb-16 z-10">
      <AmbientGlow />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div style={mk(0.05)}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-blue-200/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span className="text-blue-700 text-xs font-bold tracking-wide">{cfg.heroBadge}</span>
          </div>
        </div>

        {/* Headline — 모바일 줄바꿈 최적화 */}
        <h1 className="mt-7 sm:mt-9 font-black tracking-tight text-slate-800 leading-[1.15]" style={mk(0.15)}>
          <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem]">
            당신의 반복 업무,
          </span>
          <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem] bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent mt-1">
            AI가 대신합니다.
          </span>
        </h1>

        {/* Sub copy */}
        <p className="mt-5 sm:mt-6 max-w-xl mx-auto text-sm sm:text-base text-slate-500 leading-[1.7] font-medium px-2" style={mk(0.25)}>
          코딩 필요 없습니다.
          <br className="sm:hidden" />{" "}
          <strong className="text-slate-700">ChatGPT · Claude 등 LLM</strong>과
          <br />
          <strong className="text-slate-700">생성형 AI</strong>를 활용해
          <br className="sm:hidden" />{" "}
          반복 업무를 자동화하고 하루 1시간을 되찾습니다.
        </p>

        {/* Beginner Callout */}
        <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-emerald-200/50 shadow-sm" style={mk(0.32)}>
          <span className="text-lg">💡</span>
          <span className="text-slate-700 text-xs sm:text-sm font-bold">
            컴퓨터를 켜는 법만 아시면,{" "}
            <span className="text-emerald-600">나머진 저희가 합니다.</span>
          </span>
        </div>

        {/* What we'll do - Interactive Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3" style={mk(0.4)}>
          {[
            { icon: "🧠", title: "생성형 AI 업무 자동화", desc: "ChatGPT·Claude로 보고서·PPT·이메일을 10분 안에 완성" },
            { icon: "⌨️", title: "명령어 기반 파일 자동화", desc: "AI와 간단한 명령어로 반복 파일 작업을 한 줄로 처리" },
            { icon: "🤖", title: "AI 에이전트 구축", desc: "Make.com + AI로 24시간 자동으로 일하는 업무 시스템" },
          ].map((item, i) => (
            <div key={i} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 text-left hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="text-2xl block mb-3">{item.icon}</span>
              <h3 className="text-sm font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 w-full" style={mk(0.5)}>
          {cfg.teams ? (
            <TeamsBar />
          ) : isClosed ? (
            <>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-50 border-2 border-rose-200 shadow-sm">
                <span className="text-2xl">🔒</span>
                <div className="text-left">
                  <p className="text-sm font-black text-rose-700">{cfg.teamName} 1기 모집이 마감되었습니다</p>
                  <p className="text-xs text-rose-500 font-medium mt-0.5">총 {cfg.seatTotal}명 합류 완료</p>
                </div>
              </div>
              <MagBtn href={cfg.kakaoUrl} variant="kakao" size="lg" className="w-full sm:w-auto px-10">
                다음 기수 알림 받기
              </MagBtn>
            </>
          ) : (
            <>
              <MagBtn href="#apply" variant="primary" size="lg" className="w-full sm:w-auto px-10">
                1기 합류하기
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </MagBtn>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                추천인 코드 보유자만 입장 가능
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE — 키워드 흐름
   ═══════════════════════════════════════════════════════════════ */
function TrustBar() {
  const items = [
    "🧠 생성형 AI 업무 자동화", "⌨️ 명령어 파일 자동화", "🔰 코딩 없이 가능",
    "📂 문서 자동 생성", "📊 PPT 자동 완성", "✍️ AI 카피라이팅",
    "🤖 AI 에이전트 구축", "📧 이메일 초안 자동화", "🎯 회의록 자동 요약",
  ];
  return (
    <div className="py-4 border-y border-slate-200/40 bg-white/40 backdrop-blur-sm overflow-hidden relative z-20">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f5f7ff] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f5f7ff] to-transparent z-10" />
      <div className="flex gap-4 whitespace-nowrap" style={{ animation: "marquee 45s linear infinite", width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-block px-4 py-2 rounded-xl bg-white shadow-sm border border-slate-100 text-xs font-bold text-slate-600">{item}</span>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION — REVIEWS (수강생 리뷰)
   ═══════════════════════════════════════════════════════════════ */
function BeforeAfterSection() {
  const reviews = [
    {
      emoji: "👩‍🏫",
      role: "교육 종사자 · 학부모 상담 직종",
      highlight: "시간도 줄고, 콘텐츠도 직접 만들어요",
      parts: [
        { t: "학부모를 매일 만나는 일을 하는데, AI를 배우고 나서 " },
        { t: "반복 서류 작업 시간이 확 줄었어요.", bold: true },
        { t: "\n무엇보다 " },
        { t: "아이들을 위한 콘텐츠를 이젠 직접 만들고 있다", bold: true },
        { t: "는 게 가장 큰 변화예요." },
      ],
      color: "blue",
    },
    {
      emoji: "🏢",
      role: "중소기업 사장님",
      highlight: "언제나 든든한 기술 지원이 있어서 든든합니다",
      parts: [
        { t: "한 번 듣고 끝나는 게 아니라 " },
        { t: "리더스팀을 연속적으로 만날 수 있다", bold: true },
        { t: "는 게 달랐어요.\n막히거나 문제가 생기면 " },
        { t: "안심하고 언제든 연락하고 만날 수 있어서", bold: true },
        { t: " 정말 든든합니다." },
      ],
      color: "emerald",
    },
    {
      emoji: "📱",
      role: "직장인 · 사무직",
      highlight: "커뮤니티 덕분에 AI 흐름에 계속 올라타요",
      parts: [
        { t: "커뮤니티에 참여하면서 " },
        { t: "AI 최신 뉴스를 계속 접하게 돼요.", bold: true },
        { t: "\n스터디 모임을 통해 " },
        { t: "새로운 정보를 끊임없이 들을 수 있어서", bold: true },
        { t: " 혼자 공부할 때랑은 차원이 달라요." },
      ],
      color: "violet",
    },
    {
      emoji: "🏪",
      role: "소상공인 · 카페 운영",
      highlight: "SNS 홍보물을 이제 혼자 뚝딱 만들어요",
      parts: [
        { t: "전에는 디자이너에게 맡겼던 " },
        { t: "SNS 게시물·이벤트 포스터를 이제 직접 만들어요.", bold: true },
        { t: "\n" },
        { t: "비용도 줄고, 올리고 싶을 때 바로 올릴 수 있어서", bold: true },
        { t: " 훨씬 편해졌어요." },
      ],
      color: "orange",
    },
    {
      emoji: "🏥",
      role: "의원 · 병원 행정 담당",
      highlight: "안내문·공지 작성이 10분이면 끝나요",
      parts: [
        { t: "환자 안내문, 원내 공지, 보험 서류 설명 등 " },
        { t: "매번 새로 써야 했던 문서들을 AI가 초안을 잡아줘요.", bold: true },
        { t: "\n" },
        { t: "검토하고 다듬는 시간만 있으면 되니까", bold: true },
        { t: " 업무 부담이 확 줄었습니다." },
      ],
      color: "rose",
    },
    {
      emoji: "🏘️",
      role: "부동산 중개 · 공인중개사",
      highlight: "매물 소개 자료를 AI로 바로 만들어요",
      parts: [
        { t: "매물마다 소개 문구 쓰는 게 제일 힘들었는데, " },
        { t: "이젠 AI한테 조건 불러주면 1분 만에 초안이 나와요.", bold: true },
        { t: "\n" },
        { t: "고객한테 보내는 카카오 메시지도 훨씬 깔끔해졌고", bold: true },
        { t: " 반응도 좋아졌어요." },
      ],
      color: "indigo",
    },
  ];

  const colorMap = {
    blue:    { border: "border-blue-200",    bg: "bg-blue-50",    quote: "text-blue-700",    bold: "text-blue-800"    },
    emerald: { border: "border-emerald-200", bg: "bg-emerald-50", quote: "text-emerald-700", bold: "text-emerald-800" },
    violet:  { border: "border-violet-200",  bg: "bg-violet-50",  quote: "text-violet-700",  bold: "text-violet-800"  },
    orange:  { border: "border-orange-200",  bg: "bg-orange-50",  quote: "text-orange-700",  bold: "text-orange-800"  },
    rose:    { border: "border-rose-200",    bg: "bg-rose-50",    quote: "text-rose-700",    bold: "text-rose-800"    },
    indigo:  { border: "border-indigo-200",  bg: "bg-indigo-50",  quote: "text-indigo-700",  bold: "text-indigo-800"  },
  };

  return (
    <section className="py-16 sm:py-24 px-5 relative z-10">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold tracking-widest uppercase mb-5">수강생 리뷰</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">눈으로 보는 AI와</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                직접 쓰는 AI는 다릅니다.
              </span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => {
            const c = colorMap[r.color];
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`rounded-3xl border-2 ${c.border} ${c.bg} p-6 bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">{r.emoji}</div>
                    <div>
                      <div className="flex gap-0.5 mb-0.5">
                        {"★★★★★".split("").map((s, j) => (
                          <span key={j} className="text-sm text-yellow-400">{s}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{r.role}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black mb-3 leading-snug ${c.quote}`}>"{r.highlight}"</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed flex-1 whitespace-pre-line">
                    {r.parts.map((p, j) =>
                      p.bold
                        ? <strong key={j} className={`font-black ${c.bold}`}>{p.t}</strong>
                        : p.t
                    )}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INSTRUCTOR — 강사 소개
   ═══════════════════════════════════════════════════════════════ */
function InstructorSection() {
  const certs = [
    { label: "빅데이터전문가 1급", year: "2023", org: "한국직업능력진흥원" },
    { label: "AIPD AI 프롬프트 디자이너 2급", year: "2025", org: "한국지식재산서비스협회" },
  ];
  const careers = [
    { icon: "🏢", title: "그라운드솔루션 대표", period: "2023 ~ 현재", desc: "AI·DX 교육 커리큘럼 개발 및 사업 수행" },
    { icon: "📋", title: "㈜리더스교육평가원 이사", period: "2023 ~ 현재", desc: "평가사업 및 교육사업 수행" },
    { icon: "🏛", title: "천안시청 청년정책위원", period: "2025 ~ 현재", desc: "주거·복지 분과" },
    { icon: "✈️", title: "MWC 바르셀로나 파견", period: "2026.03.01 ~ 03.04", desc: "한국 스타트업 IR피칭 통역 · 제품설명. 리더스교육평가원 소속 · Label K Startup 협업" },
    { icon: "🏅", title: "한국생산성본부 자격인증 사무국장", period: "2018 ~ 2020 · 충청북부지역센터", desc: "국가공인 자격 인증 사업 운영 및 교육 행정 총괄" },
  ];
  const aiProjects = [
    {
      icon: "🧠",
      title: "AI 진로 인적성검사 개발 총괄",
      period: "진행중",
      desc: "리더스교육평가원 홈페이지 연동 · AI 데이터 수집·분석 기반 진로 인적성검사 프로덕트 개발 총괄",
    },
    {
      icon: "⚙️",
      title: "AI 자동화 툴 설계 · 기업 컨설팅",
      period: "2025.12",
      desc: "케이글(K-Gal) 사기업 대상 AI 자동화 워크플로우 설계 및 도입 컨설팅 수행",
    },
    {
      icon: "📱",
      title: "인플루엔서 · 브랜드 협업",
      period: "진행중",
      desc: "인스타그램 2개 계정 누적 조회수 1,000만+ 달성 · 국내외 브랜드 콜라보레이션 다수",
    },
  ];
  const lectures = [
    {
      org: "대전광역시청 교육도서관과",
      period: "2024~2025 (2개년도 · 88개교)",
      items: [
        "2025 청소년 자유학기제 특강 — AI와 미래인재",
        "2024 청소년 자유학기제 특강 — 4차산업과 미래역량",
      ],
      news: null,
    },
    {
      org: "대전대학교 RISE 사업단",
      period: "2025.11",
      items: [
        "2025.11.25 DX(디지털전환) AI 역량강화",
        "2025.11.15 DX(디지털전환) AI 테크니컬라이팅 과정",
      ],
      news: { label: "관련 언론보도", url: "https://www.ccnnews.co.kr/news/articleView.html?idxno=394406" },
    },
    {
      org: "나사렛대학교",
      period: "2025.12",
      items: [
        "2025.12.18 산업인력 AI 자서전쓰기 교육과정",
        "2025.12.19 테크니컬라이팅 파트 강의 총괄 진행",
      ],
      news: null,
    },
    {
      org: "강원특별자치도 동해시교육지원청",
      period: "2025.11.24",
      items: [
        "학교운영위원 연수 — AI시대 교육 역량 강화 특강",
      ],
      news: { label: "관련 언론보도", url: "https://www.daenews.co.kr/24677" },
    },
    {
      org: "충청남도 보령시청",
      period: "2025.09 ~ 10",
      items: [
        "2025.09.10 / 10.15 / 10.22 보령시 청소년 정책한마당",
        "청소년 정책제안관 1기 (AI+OFFLINE 블렌디드 교육)",
      ],
      news: { label: "관련 언론보도", url: "https://www.chungnamilbo.co.kr/news/articleView.html?idxno=848865" },
    },
    {
      org: "대전광역자활센터",
      period: "2023~2025 (3개년도 · 각 100시간)",
      items: [
        "2025 소속 10인 취업 진로 역량강화 컨설팅",
        "2025 소속인원 AI 역량강화 교육",
      ],
      news: { label: "관련 언론보도", url: "https://www.paxetv.com/news/articleView.html?idxno=254641" },
    },
  ];

  const [openPanel, setOpenPanel] = useState(null);
  const toggle = (key) => setOpenPanel(prev => prev === key ? null : key);

  const panels = [
    {
      key: "certs",
      label: "🏅 자격증",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          {certs.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg flex-shrink-0">🏅</div>
              <div>
                <div className="text-sm font-black text-slate-800 leading-snug">{c.label}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{c.year} · {c.org}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "careers",
      label: "💼 주요 경력",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
          {careers.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div>
                <div className="text-base font-black text-slate-800 leading-snug">{c.title}</div>
                <div className="text-xs text-blue-600 font-bold mt-0.5">{c.period}</div>
                <div className="text-sm text-slate-500 font-medium mt-0.5">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "ai",
      label: "🧠 AI 프로젝트 · 개발",
      content: (
        <div className="grid grid-cols-1 gap-2.5 pt-3">
          {aiProjects.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-100/60 shadow-sm">
              <span className="text-xl flex-shrink-0">{p.icon}</span>
              <div>
                <div className="text-sm font-black text-slate-800 leading-snug">{p.title}</div>
                <div className="text-[11px] text-indigo-600 font-bold mt-0.5">{p.period}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "lectures",
      label: "🎓 강의 · 교육 이력",
      content: (
        <div className="space-y-2.5 pt-3">
          {lectures.map((l, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-sm font-black text-slate-800">{l.org}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold">{l.period}</span>
              </div>
              <ul className="space-y-0.5 mb-1.5">
                {l.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="w-1 h-1 rounded-full bg-blue-300 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
              {l.news && (
                <a href={l.news.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors">
                  📰 {l.news.label} →
                </a>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-5 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase mb-5">강사 소개</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
              <span className="block">직접 해본 사람이</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">가르칩니다.</span>
            </h2>
          </div>
        </FadeIn>

        {/* 프로필 카드 — 항상 표시 */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 rounded-3xl border-2 border-slate-200/60 bg-slate-50/50 mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/20">
              <span className="text-white font-black text-3xl tracking-tight">JK</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-2xl font-black text-slate-900">이준기</h3>
                <span className="text-sm font-bold text-slate-400">JUNKI LEE</span>
              </div>
              <p className="text-sm font-bold text-blue-600 mb-3">그라운드솔루션 대표 · AI·DX 교육 전문가</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">영국 BNU 경영학 B.A.</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">캐나다 Concordia Uni 과정 수료</span>
              </div>
              <a href="http://pf.kakao.com/_fLvwT/friend" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                🎤 외부 강의 요청 →
              </a>
            </div>
          </div>
        </FadeIn>

        {/* 아코디언 패널 */}
        <FadeIn delay={0.15}>
          <div className="space-y-2">
            {panels.map((panel) => {
              const isOpen = openPanel === panel.key;
              return (
                <div key={panel.key} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "border-blue-200 bg-blue-50/30 shadow-sm" : "border-slate-200/60 bg-white"}`}>
                  <button
                    onClick={() => toggle(panel.key)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-black text-slate-700">{panel.label}</span>
                    <span className={`text-slate-400 text-xs font-bold transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      {panel.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CURRICULUM — Interactive Accordion (모바일에 최적)
   ═══════════════════════════════════════════════════════════════ */
function CurriculumSection() {
  const [openIdx, setOpenIdx] = useState(0);
  const tracks = [
    {
      icon: "🖥️", tag: "Level 0 · 하드웨어·소프트웨어 세팅", title: "업무용 환경 세팅 & AI 생태계 구성",
      desc: "AI 수업을 시작하기 전, 강사가 직접 현장에서 세팅합니다. 노트북·스마트폰·통신 환경 점검부터 업무용 계정 구성과 Gemini 첫 설치까지 — 내 기기에서 바로 쓸 수 있는 AI 작업 환경을 완성합니다.",
      goal: "노트북·스마트폰이 업무용 AI 생태계로 연결되고, Gemini를 즉시 사용할 수 있는 환경이 완성됩니다.",
      modules: [
        { label: "세팅 1", title: "노트북·스마트폰 환경 점검", desc: "Windows 업데이트, Chrome 설치, 저장 공간·속도 확인. 업무에 방해되는 설정 정리" },
        { label: "세팅 2", title: "통신사·데이터 환경 점검", desc: "와이파이 연결 상태, 모바일 데이터 설정, 핫스팟 구성 확인 — 현장·외근 시 끊김 없는 AI 사용 환경 구성" },
        { label: "세팅 3", title: "업무용 Google 계정 & Gemini 설치", desc: "Google Workspace Gemini 활성화 또는 Gemini 앱 설치 · 모바일·PC 계정 연동" },
        { label: "세팅 4", title: "AI 작업대 구성 & 생태계 완성", desc: "PC·모바일 Gemini 즐겨찾기 고정 · 업무 앱과의 연결 구조 완성 · 첫 업무 질문 실습" },
      ],
      badge: "2시간 · 30,000원",
      badgeColor: "bg-slate-100 text-slate-700",
      color: "slate",
    },
    {
      icon: "🌱", tag: "Level 1 · 업무용 Gemini 기초", title: "Google Workspace Gemini 핵심 활용",
      desc: "업무용 Gemini의 핵심 기능을 실습합니다. Gmail·Docs·Sheets·Slides에 내장된 Gemini를 활용해 당장 오늘 업무에 쓸 수 있는 결과물을 만들어 갑니다.",
      goal: "Gmail 이메일 초안, Docs 보고서 생성, Sheets 수식 자동화를 혼자서 할 수 있게 됩니다.",
      modules: [
        { label: "실습 A", title: "Gmail Gemini — 이메일 자동 초안", desc: "상황만 입력하면 Gemini가 격식체 이메일 작성. 답장·요약·분류까지 자동화" },
        { label: "실습 B", title: "Google Docs Gemini — 문서 초안 생성", desc: "기획서·보고서·제안서 초안을 Gemini가 대신 작성. 이후 수정만 하면 완성" },
        { label: "실습 C", title: "Google Sheets Gemini — 데이터 분석", desc: "수식 자동 생성, 데이터 요약, 인사이트 추출. 엑셀 고수 없어도 됩니다" },
        { label: "실습 D", title: "기본 프롬프트 작성법", desc: "[역할]+[상황]+[원하는 결과] 황금 공식. Gemini·ChatGPT·Claude 모두 동일 적용" },
      ],
      badge: "3시간 · 50,000원",
      badgeColor: "bg-emerald-100 text-emerald-700",
      color: "emerald",
    },
    {
      icon: "⚖️", tag: "Level 2 · 3사 AI 사무 업무 활용", title: "Gemini · ChatGPT · Claude로 사무 프로그램 자동화",
      desc: "3개 AI 툴을 상황에 맞게 골라 씁니다. PPT·슬라이드, Word·Excel, 이메일 등 매일 쓰는 사무 프로그램을 AI로 자동화하는 실전 활용법을 익힙니다.",
      goal: "PPT·슬라이드·Word·Excel 등 사무용 프로그램을 AI로 자동화할 수 있게 됩니다. 어떤 AI를 언제 써야 하는지 판단 기준이 생깁니다.",
      modules: [
        { label: "실전 A", title: "PPT·슬라이드 AI 자동화", desc: "Gamma + ChatGPT 조합으로 기획안 텍스트 → 완성 프레젠테이션. 디자인까지 자동" },
        { label: "실전 B", title: "Word·Excel AI 자동화", desc: "Claude로 Word 문서 초안·교정, ChatGPT로 Excel 수식·VBA 자동 생성. 복붙만 하면 완성" },
        { label: "비교 C", title: "Gemini·ChatGPT·Claude 강점 분리", desc: "이미지=Gemini, 코드·수식=ChatGPT, 긴 문서 분석=Claude. 상황별 최적 AI 선택법" },
        { label: "실전 D", title: "내 업무 시나리오 실습", desc: "보고서·이메일·데이터 분석·발표자료 — 실제 업무 문서로 직접 자동화 실습" },
      ],
      badge: "3시간 · 60,000원",
      badgeColor: "bg-blue-100 text-blue-700",
      color: "blue",
    },
    {
      icon: "🔗", tag: "Level 3 · Google 생태계 자동화", title: "Gemini Advanced · NotebookLM · Apps Script",
      desc: "Google 생태계를 Gemini로 연결합니다. NotebookLM으로 사내 지식베이스를 구축하고, Apps Script로 반복 업무를 완전 자동화합니다.",
      goal: "회사 내부 문서를 AI가 읽고 답변하는 지식베이스가 완성되고, Google 시트·드라이브·캘린더 반복 작업이 자동으로 돌아갑니다.",
      modules: [
        { label: "모듈 A~B", title: "Gemini Advanced 고급 기능", desc: "Deep Research, 1M 토큰 컨텍스트 활용. 방대한 문서·데이터 한 번에 처리" },
        { label: "모듈 C~D", title: "NotebookLM 사내 지식베이스 구축", desc: "회사 내부 문서 업로드 → 질문만 하면 답변. 나만의 AI 사내 챗봇 완성" },
        { label: "모듈 E~F", title: "Google Apps Script + Gemini API", desc: "LLM이 스크립트 생성, 수강생은 붙여넣고 실행. 시트·드라이브·캘린더 자동화" },
        { label: "모듈 G~H", title: "Gemini CLI + 파일 일괄 처리", desc: "터미널에서 Gemini 직접 호출. 수백 개 파일 일괄 처리, 반복 질의 자동화" },
      ],
      badge: "12시간 · 270,000원",
      badgeColor: "bg-indigo-100 text-indigo-700",
      color: "indigo",
    },
    {
      icon: "⚙️", tag: "Level 4 · Make.com 사무 자동화 파이프라인", title: "이메일·보고서·회의록이 자동으로 돌아가는 구조",
      desc: "Make.com으로 사무 업무를 완전 자동화합니다. 이메일 수신→AI 분류→시트 기록→자동 회신까지 사람 손이 필요 없는 파이프라인을 직접 만듭니다.",
      goal: "이메일·보고서·회의록·견적서 처리가 자동으로 돌아가는 파이프라인 1개 이상이 내 업무에 실제 가동됩니다.",
      modules: [
        { label: "모듈 A~C", title: "Make.com 노코드 자동화 기초~심화", desc: "Gmail 수신→Gemini 분류→Sheets 기록→자동 회신. 드래그로 연결하는 AI 파이프라인" },
        { label: "모듈 D~E", title: "회의록·보고서·견적서 자동 생성", desc: "녹취→액션아이템 추출, 기획안 텍스트→완성 PPT, 조건 입력→견적서 자동 발행" },
        { label: "모듈 F~G", title: "PowerShell + LLM 파일 자동화", desc: "파일 일괄 이름 변경, 폴더 자동 생성. LLM이 스크립트 생성 → 복붙 실행" },
        { label: "모듈 H~I", title: "멀티 AI 워크플로우 설계", desc: "Gemini·ChatGPT·Claude를 역할 분리해 연결. 각 AI가 잘하는 일을 맡기는 구조" },
      ],
      badge: "10시간 · 250,000원",
      badgeColor: "bg-violet-100 text-violet-700",
      color: "violet",
    },
    {
      icon: "🤖", tag: "Level 5 · AI 에이전트 시스템 구축", title: "Gemini Gems · 24시간 AI 직원 시스템",
      desc: "내 사업에서 24시간 일하는 AI 직원을 만듭니다. Gemini Gems로 맞춤 에이전트를 설계하고, AI 기반 홈페이지·브랜딩까지 완성합니다.",
      goal: "24시간 자동 응대·FAQ·견적 처리를 하는 AI 에이전트 1개와 AI 기반 브랜딩 자산(홈페이지·로고·SNS)이 완성됩니다.",
      modules: [
        { label: "모듈 A~C", title: "Gemini Gems 커스텀 에이전트 제작", desc: "업종별 FAQ·견적·응대 자동화 챗봇. 시스템 프롬프트 설계, 오답 방지 최적화" },
        { label: "모듈 D~E", title: "ChatGPT Custom GPT 비교 제작", desc: "Gems와 Custom GPT 동시 구성. 채널별 배포 전략 — 카카오·홈페이지·인스타 연동" },
        { label: "모듈 F~G", title: "AI 기반 홈페이지·브랜딩 제작", desc: "코딩 없이 비즈니스 랜딩 페이지 완성. Gemini·Claude로 로고·배너·SNS 일괄 제작" },
        { label: "모듈 H~I", title: "에이전트 운영·고도화 전략", desc: "실제 고객 대화 데이터 기반 프롬프트 개선. 주간 자동 리포트 설정" },
      ],
      badge: "10시간 · 300,000원",
      badgeColor: "bg-orange-100 text-orange-700",
      color: "orange",
    },
    {
      icon: "🚀", tag: "Level 6 · 사업자 맞춤 AI 솔루션 컨설팅", title: "내 사업 전용 AI 시스템 완성 프로젝트",
      desc: "Level 0~5에서 배운 모든 것을 내 사업에 통합합니다. 사업 구조를 분석하고, 맞춤 AI 솔루션을 설계·제작·배포까지 컨설팅 방식으로 완성합니다.",
      goal: "내 사업의 핵심 업무를 자동화하는 AI 솔루션이 완성·배포되고, 운영 매뉴얼과 함께 자체 유지보수 역량이 갖춰집니다.",
      modules: [
        { label: "컨설팅 A~E", title: "사업 분석 & AI 솔루션 설계", desc: "내 사업 반복 업무·병목 구간 파악. Gemini·ChatGPT·Claude 중 최적 구조 설계" },
        { label: "컨설팅 F~J", title: "바이브코딩으로 맞춤 도구 제작", desc: "자연어 명령 → LLM 코드 생성·실행. Google AI Studio·VS Code 환경에서 직접 빌드" },
        { label: "컨설팅 K~O", title: "Make.com + AI 에이전트 통합 배포", desc: "Level 3~5 자동화·에이전트를 하나의 파이프라인으로 통합 연결 및 실 운영 적용" },
        { label: "컨설팅 P~T", title: "완성 솔루션 인수인계 & 운영 교육", desc: "완성 AI 시스템 시연. 운영 매뉴얼 작성, 담당자 이관 교육, 자체 유지보수 전달" },
      ],
      badge: "20시간 · 개별 상담",
      badgeColor: "bg-rose-100 text-rose-700",
      color: "rose",
    },
    {
      icon: "🏢", tag: "기업 특강 · 직원 교육", title: "기업 맞춤 AI 직원 교육 특강",
      desc: "임직원 전체 또는 특정 부서를 대상으로 진행하는 기업 맞춤형 AI 실무 특강입니다. 업종·직무에 맞는 커리큘럼을 구성하고 현장에서 바로 쓸 수 있는 AI 활용법을 교육합니다.",
      goal: "교육 후 임직원이 AI 도구를 실무에 즉시 적용할 수 있는 상태가 됩니다. 반복 업무 감소·생산성 향상 효과를 바로 체감합니다.",
      modules: [
        { label: "구성 A", title: "직무별 맞춤 커리큘럼 설계", desc: "영업·마케팅·인사·총무·생산 등 직무별 AI 활용 포인트 분석 후 맞춤 구성" },
        { label: "구성 B", title: "생성형 AI 업무 실습", desc: "ChatGPT·Gemini·Claude로 보고서·이메일·기획서·PPT를 실시간 실습" },
        { label: "구성 C", title: "업무 자동화 시연 · 실습", desc: "Make.com·Apps Script로 반복 업무 자동화 파이프라인 직접 체험" },
        { label: "구성 D", title: "사후 관리 · Q&A 채널 제공", desc: "교육 후 임직원 질문 채널 운영. 실무 적용 과정에서 막히는 부분 즉시 지원" },
      ],
      badge: "개별 상담",
      badgeColor: "bg-pink-100 text-pink-700",
      color: "pink",
    },
  ];
  const cMap = {
    slate:   { bg: "bg-slate-500",   light: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-600",   tag: "bg-slate-100 text-slate-700" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", tag: "bg-emerald-100 text-emerald-700" },
    blue:    { bg: "bg-blue-500",    light: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-600",    tag: "bg-blue-100 text-blue-700" },
    indigo:  { bg: "bg-indigo-500",  light: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-600",  tag: "bg-indigo-100 text-indigo-700" },
    violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-600",  tag: "bg-violet-100 text-violet-700" },
    orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-600",  tag: "bg-orange-100 text-orange-700" },
    rose:    { bg: "bg-rose-500",    light: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-600",    tag: "bg-rose-100 text-rose-700" },
    pink:    { bg: "bg-pink-500",    light: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-600",    tag: "bg-pink-100 text-pink-700" },
  };

  return (
    <section id="curriculum" className="py-16 sm:py-24 px-5 relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-5">커리큘럼</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">어설픈 강의가 아닙니다.</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                내 업무에 직접 세팅합니다.
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base font-medium leading-relaxed">
              수업을 듣고 돌아가는 게 아닙니다.
              <br />
              교육이 끝나면 <strong className="text-slate-700">내 PC</strong>에
              <br className="sm:hidden" />{" "}LLM 기반 업무 자동화 환경이 구축되어 있습니다.
            </p>
          </div>
        </FadeIn>

        {/* Accordion */}
        <div className="space-y-3">
          {tracks.map((t, i) => {
            const c = cMap[t.color];
            const isOpen = openIdx === i;
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`rounded-3xl border-2 overflow-hidden transition-all duration-400 ${isOpen ? `${c.border} shadow-xl shadow-blue-50` : "border-slate-200/60 hover:border-slate-300"}`}>
                  {/* Header */}
                  <button onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${isOpen ? `${c.bg} text-white shadow-lg` : c.light}`}>
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black tracking-widest uppercase ${isOpen ? c.text : "text-slate-400"} transition-colors`}>{t.tag}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${t.badgeColor}`}>{t.badge}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-600 border border-rose-200">정원 6~12명</span>
                      </div>
                      <h3 className={`text-base sm:text-lg font-black leading-snug ${isOpen ? "text-slate-800" : "text-slate-600"} transition-colors`}>{t.title}</h3>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Body */}
                  <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-4 sm:px-6 pb-6">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 pl-16">{t.desc}</p>
                      {/* 목표 박스 */}
                      {t.goal && (
                        <div className={`pl-16 mb-4`}>
                          <div className={`flex items-start gap-2.5 p-3.5 rounded-2xl ${c.light} border ${c.border}`}
                            style={{ animation: "fadeSlideIn 0.35s ease-out 0s both" }}>
                            <span className="text-base flex-shrink-0">🎯</span>
                            <div>
                              <div className={`text-[10px] font-black tracking-widest uppercase mb-1 ${c.text}`}>이 레벨을 마치면</div>
                              <div className="text-sm font-bold text-slate-700 leading-relaxed">{t.goal}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2 pl-16">
                        {t.modules.map((m, j) => (
                          <div key={j} className={`flex gap-3 p-3.5 rounded-2xl bg-white border ${c.border} border-opacity-50`}
                            style={{ animation: `fadeSlideIn 0.35s ease-out ${(j + 1) * 0.07}s both` }}>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black whitespace-nowrap self-start flex-shrink-0 leading-tight ${c.tag}`}>
                              {m.label}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-black text-slate-800 leading-snug">{m.title}</div>
                              {m.desc && <div className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{m.desc}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICING SECTION — 수강료 안내
   ═══════════════════════════════════════════════════════════════ */
function PricingSection() {
  const [activeLevel, setActiveLevel] = useState(null);

  const stats = [
    { icon: "⏱", label: "기준 단가 (3시간)", value: "50,000원" },
    { icon: "📈", label: "심화 시간당 단가", value: "30,000원" },
    { icon: "📚", label: "전체 레벨 수", value: "7단계" },
    { icon: "🎓", label: "전체 과정", value: "Level 0~6" },
  ];

  const levels = [
    {
      num: 0,
      title: "업무용 환경 세팅 & AI 생태계 구성",
      price: "30,000원",
      priceNote: "15,000원/h · 2시간",
      hours: "2시간",
      color: "slate",
      modules: [
        { num: 0, name: "노트북·스마트폰 환경 점검", desc: "Windows 업데이트 · Chrome 설치 · 저장 공간·속도 정리" },
        { num: 0, name: "통신사·데이터 환경 점검", desc: "와이파이·모바일 데이터·핫스팟 설정 — 외근 중 끊김 없는 AI 환경 구성" },
        { num: 0, name: "Gemini 설치 & AI 생태계 완성", desc: "업무용 Google 계정 연동 · 모바일·PC Gemini 동시 설치 · 첫 실습" },
      ],
    },
    {
      num: 1,
      title: "업무용 Gemini 기초",
      price: "50,000원",
      priceNote: "17,000원/h · 3시간",
      hours: "3시간",
      color: "emerald",
      modules: [
        { num: 1, name: "Gmail · Docs · Sheets Gemini", desc: "이메일 초안 · 문서 생성 · 데이터 분석 자동화" },
        { num: 1, name: "기본 프롬프트 작성법", desc: "[역할]+[상황]+[결과] 황금 공식 실습" },
      ],
    },
    {
      num: 2,
      title: "3사 AI 사무 업무 활용",
      price: "60,000원",
      priceNote: "20,000원/h · 3시간",
      hours: "3시간",
      color: "blue",
      modules: [
        { num: 2, name: "Gemini · ChatGPT · Claude 강점 비교", desc: "이미지=Gemini, 코드=ChatGPT, 문서=Claude" },
        { num: 2, name: "내 업무 시나리오별 AI 선택 실습", desc: "상황에 맞는 AI를 직접 골라 실습" },
      ],
    },
    {
      num: 3,
      title: "Google 생태계 자동화",
      price: "270,000원",
      priceNote: "23,000원/h · 12시간",
      hours: "12시간",
      color: "indigo",
      modules: [
        { num: 3, name: "Gemini Advanced · NotebookLM", desc: "Deep Research · 사내 지식베이스 구축" },
        { num: 3, name: "Google Apps Script + Gemini API", desc: "LLM이 스크립트 생성 → 시트·드라이브 자동화" },
        { num: 3, name: "Gemini CLI 파일 일괄 처리", desc: "터미널 Gemini 호출 · 반복 질의 자동화" },
      ],
    },
    {
      num: 4,
      title: "Make.com 사무 자동화 파이프라인",
      price: "250,000원",
      priceNote: "25,000원/h · 10시간",
      hours: "10시간",
      color: "violet",
      modules: [
        { num: 4, name: "Make.com 노코드 자동화", desc: "Gmail→Gemini→Sheets→자동 회신 파이프라인" },
        { num: 4, name: "회의록·보고서·견적서 자동 생성", desc: "녹취→액션아이템 · 기획안→PPT · 견적 자동 발행" },
        { num: 4, name: "멀티 AI 워크플로우 설계", desc: "Gemini·ChatGPT·Claude 역할 분리 연결 구조" },
      ],
    },
    {
      num: 5,
      title: "AI 에이전트 시스템 구축",
      price: "300,000원",
      priceNote: "30,000원/h · 10시간",
      hours: "10시간",
      color: "orange",
      modules: [
        { num: 5, name: "Gemini Gems 커스텀 에이전트", desc: "24시간 FAQ·견적·응대 자동화 챗봇 제작" },
        { num: 5, name: "ChatGPT Custom GPT 비교 제작", desc: "채널별 배포 — 카카오·홈페이지·인스타 연동" },
        { num: 5, name: "AI 기반 홈페이지·브랜딩 제작", desc: "코딩 없이 랜딩 페이지 + AI 로고·배너 완성" },
      ],
    },
    {
      num: 6,
      title: "사업자 맞춤 AI 솔루션 컨설팅",
      price: "개별 상담",
      priceNote: "20시간 · 인원별 협의",
      hours: "20시간",
      color: "rose",
      modules: [
        { num: 6, name: "사업 분석 & AI 솔루션 설계", desc: "내 사업 병목 파악 · 최적 AI 구조 설계" },
        { num: 6, name: "바이브코딩으로 맞춤 도구 제작", desc: "자연어 명령 → LLM 코드 생성 · Google AI Studio 빌드" },
        { num: 6, name: "통합 배포 & 운영 매뉴얼 인수인계", desc: "Make.com + 에이전트 통합 · 담당자 이관 교육" },
      ],
    },
    {
      num: null,
      title: "기업 맞춤 AI 직원 교육 특강",
      price: "개별 상담",
      priceNote: "인원·시간·직무별 협의",
      hours: "기업 맞춤",
      color: "pink",
      modules: [
        { num: null, name: "직무별 맞춤 커리큘럼 설계", desc: "업종·직무 분석 후 현장 밀착형 AI 교육 구성" },
        { num: null, name: "생성형 AI 실무 실습", desc: "보고서·이메일·PPT·데이터 분석 즉시 적용" },
        { num: null, name: "사후 관리 · Q&A 지원", desc: "교육 후 실무 적용 단계까지 지속 지원" },
      ],
    },
  ];

  const packages = [
    {
      icon: "🌱",
      title: "입문 패키지",
      levels: "Level 0 ~ 2",
      original: "140,000원",
      price: "119,000원",
      save: "21,000원 절약",
      best: false,
      color: "emerald",
    },
    {
      icon: "💼",
      title: "실무 패키지",
      levels: "Level 0 ~ 3",
      original: "410,000원",
      price: "339,000원",
      save: "71,000원 절약",
      best: false,
      color: "indigo",
    },
    {
      icon: "⚙️",
      title: "자동화 패키지",
      levels: "Level 0 ~ 4",
      original: "660,000원",
      price: "549,000원",
      save: "111,000원 절약",
      best: true,
      color: "violet",
    },
    {
      icon: "🤖",
      title: "마스터 패키지",
      levels: "Level 0 ~ 5",
      original: "960,000원",
      price: "799,000원",
      save: "161,000원 절약",
      best: false,
      color: "orange",
    },
    {
      icon: "🚀",
      title: "솔루션 패키지",
      levels: "Level 0 ~ 6 전체",
      original: "개별 상담 포함",
      price: "개별 상담",
      save: "인원별 협의",
      best: false,
      color: "rose",
    },
    {
      icon: "🏢",
      title: "기업 특강 패키지",
      levels: "기업 직원 교육",
      original: "인원·직무별 상이",
      price: "개별 상담",
      save: "단체 할인 적용",
      best: false,
      color: "slate",
    },
  ];

  const cMap = {
    slate:   { bg: "bg-slate-500",   light: "bg-slate-50",   border: "border-slate-300",   text: "text-slate-600",   tag: "bg-slate-100 text-slate-700",   glow: "shadow-slate-100/50" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-600", tag: "bg-emerald-100 text-emerald-700", glow: "shadow-emerald-100/50" },
    blue:    { bg: "bg-blue-500",    light: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-600",    tag: "bg-blue-100 text-blue-700",    glow: "shadow-blue-100/50" },
    indigo:  { bg: "bg-indigo-500",  light: "bg-indigo-50",  border: "border-indigo-300",  text: "text-indigo-600",  tag: "bg-indigo-100 text-indigo-700",  glow: "shadow-indigo-100/50" },
    violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-600",  tag: "bg-violet-100 text-violet-700",  glow: "shadow-violet-100/50" },
    orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-300",  text: "text-orange-600",  tag: "bg-orange-100 text-orange-700",  glow: "shadow-orange-100/50" },
    rose:    { bg: "bg-rose-500",    light: "bg-rose-50",    border: "border-rose-300",    text: "text-rose-600",    tag: "bg-rose-100 text-rose-700",    glow: "shadow-rose-100/50" },
    pink:    { bg: "bg-pink-500",    light: "bg-pink-50",    border: "border-pink-300",    text: "text-pink-600",    tag: "bg-pink-100 text-pink-700",    glow: "shadow-pink-100/50" },
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-5 relative z-10 overflow-hidden">
      <AmbientGlow />
      <div className="relative z-10 max-w-2xl mx-auto">

        {/* ── 섹션 헤더 ── */}
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-5">수강료 안내</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">내 수준에 맞게,</span>
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">필요한 레벨만 골라 듣습니다.</span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base font-medium leading-relaxed">
              Level 0은 <strong className="text-slate-700">30,000원</strong>부터 시작합니다.
              <br />원하는 레벨까지만 수강해도 됩니다.
              <br /><span className="text-xs text-slate-400">심화 레벨일수록 시간당 단가가 올라갑니다.</span>
            </p>
          </div>
        </FadeIn>

        {/* ── 기본 단가 카드 4개 ── */}
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">{s.label}</div>
                <div className="text-base sm:text-lg font-black text-slate-800">{s.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── 레벨별 카드 ── */}
        <div className="space-y-3 mb-10">
          {levels.map((lv, i) => {
            const c = cMap[lv.color];
            const isOpen = activeLevel === i;
            return (
              <FadeIn key={i} delay={i * 0.07}>
                <div className={`rounded-3xl border-2 overflow-hidden transition-all duration-300 ${isOpen ? `${c.border} shadow-xl ${c.glow}` : "border-slate-200/60 hover:border-slate-300"}`}>
                  {/* 헤더 */}
                  <button
                    onClick={() => setActiveLevel(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm transition-colors duration-300 ${isOpen ? `${c.bg} text-white shadow-lg` : `${c.light} ${c.text}`}`}>
                      L{lv.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${isOpen ? c.text : "text-slate-400"}`}>{lv.num !== null ? `Level ${lv.num}` : "상담 문의"}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${c.tag}`}>{lv.priceNote}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-base sm:text-lg font-black leading-snug transition-colors ${isOpen ? "text-slate-800" : "text-slate-600"}`}>{lv.title}</h3>
                        <span className="text-xs text-slate-400 font-medium">{lv.hours}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-base sm:text-xl font-black ${c.text}`}>{lv.price}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{lv.priceNote}</div>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 모듈 목록 */}
                  <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 sm:px-6 pb-6 space-y-2.5">
                      {lv.modules.map((m, j) => (
                        <div key={j} className={`flex items-start gap-3 p-3.5 rounded-2xl bg-white border ${c.border.replace("border-", "border-").replace("-300", "-100")}`}
                          style={{ animation: `fadeSlideIn 0.35s ease-out ${j * 0.07}s both` }}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[10px] font-black shadow-sm ${c.bg}`}>
                            {m.num}
                          </span>
                          <div>
                            <div className="text-sm font-black text-slate-800 leading-snug">{m.name}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">{m.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* ── 패키지 카드 ── */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-xs font-bold tracking-widest uppercase">추천 패키지</span>
          </div>
        </FadeIn>

        {/* 일반 패키지 (4종) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.filter(p => p.price !== "개별 상담").map((pkg, i) => {
            const c = cMap[pkg.color];
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`relative rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 ${
                  pkg.best
                    ? `${c.border} bg-gradient-to-b from-violet-50/80 to-white shadow-2xl ${c.glow} scale-[1.02]`
                    : "border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-slate-300"
                }`}>
                  {pkg.best && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[11px] font-black shadow-lg shadow-violet-500/30">
                        ✨ 인기
                      </span>
                    </div>
                  )}
                  <div className="text-3xl mb-3 text-center">{pkg.icon}</div>
                  <h3 className="text-center font-black text-slate-800 text-sm sm:text-base mb-1">{pkg.title}</h3>
                  <p className={`text-center text-[11px] font-bold mb-4 ${c.text}`}>{pkg.levels}</p>
                  <div className="text-center mb-3">
                    <div className="text-xs text-slate-400 line-through font-medium mb-1">{pkg.original}</div>
                    <div className={`text-lg sm:text-xl font-black ${c.text}`}>{pkg.price}</div>
                  </div>
                  <div className={`text-center text-[11px] font-black px-3 py-1.5 rounded-full ${c.light} ${c.text}`}>
                    {pkg.save}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* 개별 상담 패키지 (2종) */}
        <FadeIn delay={0.15}>
          <div className="mt-6 flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">개별 상담</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {packages.filter(p => p.price === "개별 상담").map((pkg, i) => {
            const c = cMap[pkg.color];
            return (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative rounded-3xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 sm:p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-2xl ${c.light} border-2 ${c.border}`}>
                    {pkg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-800 text-sm sm:text-base mb-0.5">{pkg.title}</h3>
                    <p className={`text-[11px] font-bold mb-2 ${c.text}`}>{pkg.levels}</p>
                    <div className={`text-xl font-black ${c.text} mb-1`}>{pkg.price}</div>
                    <div className={`inline-block text-[11px] font-black px-3 py-1 rounded-full ${c.light} ${c.text}`}>
                      {pkg.save}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* 결제 안내 */}
        <FadeIn delay={0.3}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 현장 카드결제 */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/60 flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">💳</div>
              <div>
                <div className="text-sm font-black text-slate-800 mb-1">현장 카드결제</div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  교육 당일 현장에서<br />
                  신용·체크카드 결제 가능합니다.
                </p>
              </div>
            </div>
            {/* 외부강의 요청 */}
            <a href="http://pf.kakao.com/_fLvwT/friend" target="_blank" rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-blue-50/80 border-2 border-blue-200 flex items-start gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🎤</span>
              </div>
              <div>
                <div className="text-sm font-black text-blue-700 mb-1 group-hover:underline">외부 강의 요청하기 →</div>
                <p className="text-xs text-blue-600 font-medium leading-relaxed">
                  기업·기관 출강 문의는<br />
                  리더스교육평가원 홈페이지로 연락 주세요.
                </p>
              </div>
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 font-medium">
            💡 모든 수강료에는 <strong className="text-slate-600">강사 현장 직접 세팅</strong>이 포함됩니다. Level 0은 하드웨어·소프트웨어 세팅 전담.
          </p>
        </FadeIn>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS STEPS — Interactive horizontal scroll (mobile)
   ═══════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const cfg = useCfg();
  const [active, setActive] = useState(0);
  const steps = [
    { icon: "🔗", num: "01", title: "추천인 코드 받기", desc: "기존 멤버나 SNS를 통해 추천인 코드를 받으세요." },
    { icon: "💬", num: "02", title: "오픈채팅 입장", desc: "카카오 오픈채팅방에 코드와 함께 입장합니다." },
    { icon: "📋", num: "03", title: "레벨 상담", desc: "현재 수준과 목표에 맞는 맞춤 트랙을 선택합니다." },
    { icon: "🚀", num: "04", title: "현장 세팅", desc: `${cfg.regionText} 교육장에서 내 기기에 AI를 직접 설치합니다.` },
  ];
  useEffect(() => { const t = setInterval(() => setActive((p) => (p + 1) % steps.length), 3500); return () => clearInterval(t); }, []);

  return (
    <section className="py-16 sm:py-24 px-5 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold tracking-widest uppercase mb-5">수강 절차</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">참여는 이렇게</span>
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">간단합니다.</span>
            </h2>
          </div>
        </FadeIn>

        {/* Steps */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map((s, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${i === active
                  ? "bg-blue-50 border-blue-300 shadow-lg shadow-blue-100/50 scale-[1.03]"
                  : "bg-white border-slate-200/60 hover:border-slate-300"}`}>
                {i === active && (
                  <div className="absolute bottom-0 left-2 right-2 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 overflow-hidden">
                    <div className="h-full bg-white/40" style={{ animation: "progressBar 3.5s linear", width: "100%" }} />
                  </div>
                )}
                <span className="text-2xl block mb-2">{s.icon}</span>
                <div className={`text-[10px] font-black tracking-widest mb-1 transition-colors ${i === active ? "text-blue-500" : "text-slate-300"}`}>단계 {s.num}</div>
                <div className="font-black text-slate-800 text-xs sm:text-sm mb-1 leading-snug">{s.title}</div>
                <div className={`text-[11px] leading-relaxed transition-all duration-300 ${i === active ? "text-slate-500 max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0 overflow-hidden"}`}>{s.desc}</div>
              </button>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMMUNITY — 한 번이 아닌, 계속 함께
   ═══════════════════════════════════════════════════════════════ */
function CommunitySection() {
  const cfg = useCfg();
  const benefits = [
    {
      icon: "🔄",
      title: "끝나지 않는 AI 업데이트",
      desc: "AI는 매주 진화합니다. 새로운 기능, 새로운 도구가 나올 때마다 커뮤니티에서 가장 먼저 정리해 공유합니다.",
    },
    {
      icon: "📚",
      title: "정기 스터디 & 워크숍",
      desc: "월 1회 오프라인 스터디를 진행합니다. 혼자 하면 막히는 것도 함께하면 10분이면 해결됩니다.",
    },
    {
      icon: "💬",
      title: "실시간 질문 & 해결 채널",
      desc: "막히는 순간, 채팅방에 질문하면 멤버와 운영진이 바로 답변합니다. 혼자 헤매는 시간은 끝입니다.",
    },
    {
      icon: "🚀",
      title: "신규 Workflow 레시피 배포",
      desc: "운영진이 직접 만든 최신 자동화 레시피를 멤버 전용으로 배포합니다. 복사해서 바로 내 기기에 적용하세요.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-5 relative z-10 overflow-hidden">
      <AmbientGlow />
      <div className="relative z-10 max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-xs font-bold tracking-widest uppercase mb-5">커뮤니티</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">한 번 교육하고 끝?</span>
              <span className="block bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                아닙니다. 계속 같이 갑니다.
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base font-medium leading-relaxed">
              교육은 시작일 뿐입니다.
              <br />
              리더스 AI랩은 <strong className="text-slate-700">지속적인 커뮤니티 활동</strong>을 통해
              <br className="sm:hidden" />{" "}
              끊임없이 성장하는 환경을 만듭니다.
            </p>
            {/* 무료 참여 뱃지 */}
            <div className="mt-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-emerald-700 text-sm font-black">커뮤니티 참여는 <span className="underline underline-offset-2">완전 무료</span>입니다.</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 font-medium">수강 여부와 무관하게 누구나 부담 없이 참여하고 정보를 나눌 수 있습니다.</p>
          </div>
        </FadeIn>

        {/* Benefit Cards */}
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl border-2 border-slate-200/60 bg-white/70 backdrop-blur-sm hover:border-violet-300 hover:bg-violet-50/30 hover:shadow-lg hover:shadow-violet-100/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 group-hover:bg-violet-500 flex items-center justify-center text-2xl flex-shrink-0 transition-colors duration-300">
                  <span className="group-hover:scale-110 transition-transform">{b.icon}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-slate-800 mb-1.5 group-hover:text-violet-700 transition-colors">{b.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA Callout */}
        <FadeIn delay={0.35}>
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center shadow-xl shadow-violet-500/20">
            <p className="text-lg sm:text-xl font-black leading-snug mb-2">
              &ldquo;혼자 공부하다 포기하셨죠?&rdquo;
            </p>
            <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed mb-4">
              이제는 같은 목표를 가진 {cfg.regionText} 사람들과
              <br className="sm:hidden" />{" "}
              함께 가세요. 포기할 수가 없습니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-black">🎉 커뮤니티 참여 무료</span>
              <span className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-black">📢 AI 정보 실시간 공유</span>
              <span className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-black">🤝 수강생·비수강생 모두 OK</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APPLICATION — 모바일 우선 폼
   ═══════════════════════════════════════════════════════════════ */
function ApplicationSection() {
  const cfg = useCfg();
  const isClosed = cfg.status === "closed";
  const [form, setForm] = useState({ name: "", role: "", phone: "", task: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveCount, setLiveCount] = useState(null);
  const TOTAL = cfg.seatTotal;

  // 실시간 신청자 수 가져오기
  useEffect(() => {
    const getCount = () => {
      fetch("/api/count")
        .then((r) => r.json())
        .then((d) => setLiveCount(d.count))
        .catch(() => setLiveCount(26));
    };
    
    getCount(); // 초기 실행
    const interval = setInterval(getCount, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        setLoading(false);
        return;
      }
      setLiveCount(data.count);
      setSubmitted(true);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300";

  if (cfg.teams) {
    return (
      <section id="apply" className="py-16 sm:py-24 px-5 pt-28 sm:pt-32 relative z-10 overflow-hidden">
        <AmbientGlow />
        <div className="relative z-10 max-w-xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-5">지금 시작하세요</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight">
                <span className="block">지역별 1기를</span>
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">지금 확인하세요.</span>
              </h2>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed font-medium">
                내 지역 팀에 합류하거나, 다음 기수 알림을 받으세요.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <TeamsBar />
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-16 sm:py-24 px-5 pt-28 sm:pt-32 relative z-10 overflow-hidden">
      <AmbientGlow />
      <div className="relative z-10 max-w-lg mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-5">지금 신청하기</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">{cfg.teamName} AI 실무 커뮤니티</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{isClosed ? "1기 모집이 마감되었습니다." : "1기 멤버를 모집합니다."}</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed font-medium">
              가장 먼저 합류한 분들이
              <br className="sm:hidden" />{" "}가장 큰 혜택을 받습니다.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SeatBar total={TOTAL} filled={isClosed ? cfg.seatTotal : (liveCount ?? cfg.seatFilled)} className="mb-6 px-1" />
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
            {isClosed ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-100">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{cfg.teamName} 1기 모집 마감</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  총 <strong className="text-rose-600">{cfg.seatTotal}명</strong>이 합류했습니다.<br />
                  다음 기수 오픈 알림을 카카오로 받으세요.
                </p>
                <MagBtn href={cfg.kakaoUrl} variant="kakao" size="md">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.85.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
                  다음 기수 알림 받기
                </MagBtn>
              </div>
            ) : !submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 font-bold tracking-wider uppercase mb-1.5 ml-1">이름</label>
                  <input type="text" required placeholder="홍길동" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-bold tracking-wider uppercase mb-1.5 ml-1">소속 / 직무</label>
                  <input type="text" required placeholder="OO기업 마케팅팀 / 카페 대표 등" className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-bold tracking-wider uppercase mb-1.5 ml-1">연락처</label>
                  <input type="tel" required placeholder="010-0000-0000" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-bold tracking-wider uppercase mb-1.5 ml-1">가장 자동화하고 싶은 업무</label>
                  <textarea required rows={3}
                    placeholder="예: 매일 반복하는 엑셀 보고서 정리"
                    className={`${inputCls} resize-none`} value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold">
                    {error}
                  </div>
                )}

                <MagBtn type="submit" variant="primary" size="lg" className={`w-full mt-2 ${loading ? "opacity-70 pointer-events-none" : ""}`}>
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      신청 중...
                    </>
                  ) : (
                    <>
                      1기 신청서 제출
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </MagBtn>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-100" style={{ animation: "popIn 0.5s cubic-bezier(.2,.8,.2,1)" }}>
                  <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">신청 완료!</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  오픈채팅방에 입장하시면
                  <br />상세 안내를 받으실 수 있습니다.
                </p>
                <MagBtn href={cfg.kakaoUrl} variant="kakao" size="md">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.85.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
                  오픈채팅방 입장하기
                </MagBtn>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Kakao Direct */}
        <FadeIn delay={0.25}>
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 mb-3 font-medium">폼 없이 바로 참여하고 싶다면?</p>
            <MagBtn href={cfg.kakaoUrl} variant="kakao" size="md" className="w-full sm:w-auto">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.85.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
              카카오 오픈채팅 바로 입장
            </MagBtn>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEVEL QUIZ — 나에게 맞는 레벨은?
   ═══════════════════════════════════════════════════════════════ */
function LevelQuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    {
      q: "스마트폰으로 어느 정도 하시나요?",
      options: [
        { label: "📞 전화·카카오톡만 합니다", val: 1 },
        { label: "📸 사진 찍고 SNS 올립니다", val: 2 },
        { label: "🎬 유튜브·릴스 즐겨 봅니다", val: 2 },
        { label: "📲 앱 설치·설정 익숙합니다", val: 3 },
      ],
    },
    {
      q: "지금 가장 불편한 업무는?",
      options: [
        { label: "✍️ 홍보 문구·SNS 글쓰기", val: 2 },
        { label: "📊 엑셀·보고서 반복 작업", val: 3 },
        { label: "🎬 영상·이미지 콘텐츠 제작", val: 2 },
        { label: "🤖 아예 AI 직원을 두고 싶다", val: 4 },
      ],
    },
    {
      q: "PC(노트북) 사용은 어떤가요?",
      options: [
        { label: "💻 거의 안 씁니다", val: 1 },
        { label: "📝 워드·엑셀 기본은 합니다", val: 2 },
        { label: "🌐 인터넷·이메일 잘 씁니다", val: 3 },
        { label: "⚙️ 새 프로그램 설치도 능숙합니다", val: 4 },
      ],
    },
  ];

  const RESULTS = {
    1: { level: "Level 0 → 1", emoji: "🖥️", title: "세팅부터 차근차근 시작하세요!", desc: "AI가 낯설어도 괜찮습니다. 강사가 직접 기기를 세팅하고 업무용 Gemini 첫 사용까지 함께합니다.", color: "slate", price: "80,000원" },
    2: { level: "Level 0 → 2", emoji: "🌱", title: "입문 패키지 추천!", desc: "Gemini 세팅부터 3사 AI 비교 활용까지. 어떤 AI를 언제 써야 하는지 완전히 이해하게 됩니다.", color: "blue", price: "119,000원" },
    3: { level: "Level 0 → 3", emoji: "💼", title: "실무 패키지 추천!", desc: "Google 생태계 자동화까지 완성합니다. NotebookLM 지식베이스부터 Apps Script 자동화까지.", color: "indigo", price: "339,000원" },
    4: { level: "Level 0 → 4", emoji: "⚙️", title: "자동화 패키지 추천!", desc: "Make.com으로 이메일·보고서·회의록이 자동으로 돌아가는 파이프라인을 직접 만듭니다.", color: "violet", price: "549,000원" },
  };

  const handleAnswer = (val) => {
    const next = [...answers, val];
    setAnswers(next);
    if (next.length === questions.length) {
      const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
      setResult(RESULTS[Math.max(1, Math.min(4, avg))]);
      setStep(questions.length);
    } else {
      setStep(next.length);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); };

  const cMap = {
    emerald: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", btn: "bg-emerald-500" },
    blue:    { border: "border-blue-300",    bg: "bg-blue-50",    text: "text-blue-700",    btn: "bg-blue-500" },
    indigo:  { border: "border-indigo-300",  bg: "bg-indigo-50",  text: "text-indigo-700",  btn: "bg-indigo-500" },
    violet:  { border: "border-violet-300",  bg: "bg-violet-50",  text: "text-violet-700",  btn: "bg-violet-500" },
  };

  return (
    <section className="py-16 sm:py-20 px-5 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl relative z-10">
      <div className="max-w-lg mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-5">레벨 진단</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
              <span className="block">나에게 맞는 레벨은?</span>
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">3문제로 바로 확인</span>
            </h2>
          </div>
        </FadeIn>

        {/* Progress */}
        {step < questions.length && (
          <div className="flex gap-1.5 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < step ? "bg-blue-500" : i === step ? "bg-blue-300" : "bg-slate-200"}`} />
            ))}
          </div>
        )}

        {/* Question */}
        {step < questions.length && (
          <FadeIn key={step}>
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/60">
              <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">질문 {step + 1} / {questions.length}</p>
              <h3 className="text-base sm:text-lg font-black text-slate-800 mb-5 leading-snug">{questions[step].q}</h3>
              <div className="space-y-2.5">
                {questions[step].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt.val)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-sm font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 active:scale-[0.98]">
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Result */}
        {result && (
          <FadeIn>
            <div className={`rounded-3xl border-2 p-6 sm:p-8 ${cMap[result.color].border} ${cMap[result.color].bg}`}>
              <div className="text-center mb-5">
                <span className="text-5xl block mb-3">{result.emoji}</span>
                <div className={`text-xs font-black tracking-widest uppercase mb-2 ${cMap[result.color].text}`}>{result.level}</div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-3">{result.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.desc}</p>
              </div>
              <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/80 border border-white mb-4">
                <span className="text-xs text-slate-500 font-medium">추천 패키지 가격</span>
                <span className={`text-lg font-black ${cMap[result.color].text}`}>{result.price}</span>
              </div>
              <div className="flex gap-2">
                <MagBtn href="#apply" variant="primary" size="sm" className="flex-1 justify-center">지금 신청하기</MagBtn>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-500 text-sm font-bold hover:border-slate-300 transition-colors">다시하기</button>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEAMS BAR — 두 팀 상태 카드 (상단/하단 공통 사용)
   ═══════════════════════════════════════════════════════════════ */
function TeamsBar() {
  const cfg = useCfg();
  const teams = cfg.teams;
  const [liveCount, setLiveCount] = useState(null);

  useEffect(() => {
    fetch("/api/count")
      .then((r) => r.json())
      .then((d) => setLiveCount(d.count))
      .catch(() => {});
  }, []);

  if (!teams) return null;
  return (
    <div className="w-full max-w-xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
      {teams.map((t, i) => {
        const isClosed = t.status === "closed";
        const filledCount = (!isClosed && liveCount !== null) ? liveCount : t.seatFilled;
        return (
          <div key={i} className={`rounded-3xl border-2 p-5 flex flex-col gap-3 ${isClosed ? "bg-rose-50/80 border-rose-200" : "bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200 shadow-lg shadow-blue-100/60"}`}>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-black w-fit ${isClosed ? "bg-rose-100 border-rose-200 text-rose-600" : "bg-emerald-100 border-emerald-200 text-emerald-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isClosed ? "bg-rose-400" : "bg-emerald-400 animate-pulse"}`} />
              {t.statusLabel}
            </div>
            <div>
              <h3 className={`text-base font-black leading-snug ${isClosed ? "text-slate-500" : "text-slate-800"}`}>{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{t.region}</p>
              <p className={`text-xs font-bold mt-1 ${isClosed ? "text-rose-500" : "text-blue-600"}`}>
                {isClosed ? `${filledCount}명 합류 완료` : `현재 ${filledCount}/${t.seatTotal}명`}
              </p>
            </div>
            {isClosed ? (
              <MagBtn href={t.kakaoUrl} variant="kakao" size="sm" className="w-full py-2.5 text-xs">
                다음 기수 알림
              </MagBtn>
            ) : (
              <MagBtn href={`${t.href}#apply`} variant="primary" size="sm" className="w-full py-2.5 text-xs">
                지금 신청하기 →
              </MagBtn>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAV — 모바일 최적화
   ═══════════════════════════════════════════════════════════════ */
function NavBar() {
  const cfg = useCfg();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  const isClosed = cfg.status === "closed";
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm py-3" : "bg-transparent py-4 sm:py-5"}`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between px-5">
        <a href="https://risegen.kr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="LEADERS AI LABS 로고" width={160} height={40} className="h-7 sm:h-8 w-auto object-contain hover:opacity-80 transition-opacity" priority />
          {cfg.teams ? (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold">충남 1기 모집중</span>
          ) : isClosed ? (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-bold">{cfg.teamName} 1기 모집 마감</span>
          ) : (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold">{cfg.teamName} 1기 모집중</span>
          )}
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="https://www.youtube.com/@leadersailab" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200 group">
            <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-[11px] font-bold text-red-500">유튜브</span>
          </a>
          {!cfg.hubMode && <a href="#pricing" className="hidden sm:inline-block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">수강료</a>}
          {cfg.teams ? (
            <MagBtn href="/chungnam#apply" variant="primary" size="sm" className="text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
              충남 신청하기
            </MagBtn>
          ) : isClosed ? (
            <MagBtn href={cfg.kakaoUrl} variant="kakao" size="sm" className="text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
              다음 기수 알림
            </MagBtn>
          ) : (
            <MagBtn href="#apply" variant="primary" size="sm" className="text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
              신청하기
            </MagBtn>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING MOBILE CTA
   ═══════════════════════════════════════════════════════════════ */
function FloatingCTA() {
  const cfg = useCfg();
  const [visible, setVisible] = useState(false);
  useEffect(() => { const fn = () => setVisible(window.scrollY > 500); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <div className={`fixed bottom-0 inset-x-0 z-40 sm:hidden transition-all duration-400 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-4 py-3 flex gap-2 shadow-xl">
        <a href={cfg.kakaoUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FEE500] text-[#3C1E1E] text-sm font-bold">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.85.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
          오픈채팅
        </a>
        <a href="#apply" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/15">
          1기 신청
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY (VIBE) SECTION — Dual-Marquee Photo Wall
   ═══════════════════════════════════════════════════════════════ */
function GallerySection() {
  const images = Array.from({ length: 15 }, (_, i) => `/images/gallery/홈페이지 사진 ${i + 1}.png`);
  const row1 = images.slice(0, 8);
  const row2 = images.slice(8, 15);

  return (
    <section className="py-16 sm:py-24 overflow-hidden bg-slate-50 border-y border-slate-200/40 relative z-10">
      <div className="max-w-xl mx-auto px-5 mb-10 text-center relative z-20">
        <FadeIn>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-5">현장 사진</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight">
            <span className="block">열기로 가득한</span>
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">오프라인 현장</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed font-medium">
            백문이 불여일견. 우리는 이미 오프라인에서<br className="sm:hidden" /> 수많은 변화를 만들고 있습니다.
          </p>
        </FadeIn>
      </div>

      <div className="relative flex flex-col gap-4 sm:gap-6 pb-4">
        {/* 그라데이션 오버레이 (좌우 스크롤 자연스럽게) */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

        {/* 첫 번째 줄 (왼쪽으로 흐름) */}
        <div className="flex gap-4 sm:gap-6 w-max hover:[animation-play-state:paused]" style={{ animation: "marquee-left 40s linear infinite" }}>
          {[...row1, ...row1].map((src, i) => (
            <div key={`r1-${i}`} className="relative w-48 h-32 sm:w-72 sm:h-48 rounded-2xl overflow-hidden shadow-sm group">
              <Image src={src} alt="교육 현장" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 640px) 192px, 288px" />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* 두 번째 줄 (오른쪽으로 흐름) */}
        <div className="flex gap-4 sm:gap-6 w-max hover:[animation-play-state:paused] -ml-[200px]" style={{ animation: "marquee-right 35s linear infinite" }}>
          {[...row2, ...row2].map((src, i) => (
            <div key={`r2-${i}`} className="relative w-48 h-32 sm:w-72 sm:h-48 rounded-2xl overflow-hidden shadow-sm group">
              <Image src={src} alt="교육 현장" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 640px) 192px, 288px" />
              <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Animation Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HUB HERO — 허브 전용 히어로 (실적 + 팀 카드)
   ═══════════════════════════════════════════════════════════════ */
function HubHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mk = (d) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `all 0.8s cubic-bezier(.2,.8,.2,1) ${d}s`,
  });

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-5 pt-24 pb-20 z-10">
      <AmbientGlow />
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">

        {/* 배지 */}
        <div style={mk(0.05)}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-blue-200/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-blue-700 text-xs font-bold tracking-wide">충남팀 1기 모집중</span>
          </div>
        </div>

        {/* 헤드라인 */}
        <div style={mk(0.12)}>
          <h1 className="mt-7 font-black tracking-tight text-slate-800 leading-[1.15]">
            <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3rem]">당신의 반복 업무,</span>
            <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent mt-1">
              AI가 대신합니다.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            코딩 없이 생성형 AI로 하루 1시간을 되찾는<br />
            <strong className="text-slate-700">지역 밀착형 AI 실무 교육</strong>
          </p>
        </div>

        {/* 실적 수치 */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 max-w-sm mx-auto" style={mk(0.22)}>
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-1">70명</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">대전 1기 모집 완료</div>
          </div>
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 mb-1">40명</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">1차 오프라인 참여</div>
          </div>
        </div>

        {/* 팀 카드 */}
        <div className="mt-6" style={mk(0.32)}>
          <TeamsBar />
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function TeamLandingPage({ config }) {
  const isHub = config.hubMode;
  return (
    <TeamCtx.Provider value={config}>
      <main className="min-h-screen relative selection:bg-blue-200 selection:text-blue-900">
        <NavBar />

        {isHub ? (
          <>
            <HubHeroSection />
            <GallerySection />
          </>
        ) : config.applyMode ? (
          <>
            <ApplicationSection />
            <FloatingCTA />
          </>
        ) : (
          <>
            <HeroSection />
            <TrustBar />
            <BeforeAfterSection />
            <InstructorSection />
            <CurriculumSection />
            <LevelQuizSection />
            <ProcessSection />
            <GallerySection />
            <CommunitySection />
            <PricingSection />
            <ApplicationSection />
            <FloatingCTA />
          </>
        )}

        <footer className="py-10 bg-slate-900 border-t border-slate-800 text-center relative z-20">
          <div className="max-w-5xl mx-auto px-5 flex flex-col items-center">
            <a href="https://risegen.kr" target="_blank" rel="noopener noreferrer">
              <Image src="/logo.png" alt="LEADERS AI LABS 로고" width={180} height={45} className="h-8 w-auto object-contain brightness-0 invert mb-3 hover:opacity-80 transition-opacity" />
            </a>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 mb-1">
              <p className="text-sm text-slate-500"><span className="text-slate-400 font-bold">대전본사</span> · 대전광역시 중구 대종로 417-1번지 1,2층</p>
              <span className="hidden sm:inline text-slate-700">|</span>
              <p className="text-sm text-slate-500"><span className="text-slate-400 font-bold">충남지사</span> · 충남 천안시 서북구 1공단 1길 52 센트하임 2층</p>
            </div>
            <p className="text-xs text-slate-600">AI(DX)교육 전문 · LLM 기반 사무 업무 자동화 전문 교육기관</p>
            <div className="w-12 h-px bg-slate-700 my-4" />
            <a href="https://www.youtube.com/@leadersailab" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-red-600/20 border border-slate-700 hover:border-red-500/50 transition-all duration-300 group mb-4">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">YouTube · @leadersailab</span>
            </a>
            <p className="text-xs text-slate-600">© 2025 LEADERS AI LABS. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </TeamCtx.Provider>
  );
}
