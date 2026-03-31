"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
            <span className="text-blue-700 text-xs font-bold tracking-wide">대전 한정 · 1기 100명 선착순</span>
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
            { icon: "🧠", title: "LLM 업무 자동화", desc: "ChatGPT·Claude로 보고서·PPT·이메일을 10분 안에 완성" },
            { icon: "⌨️", title: "CLI 기반 PC 자동화", desc: "PowerShell + AI로 반복 파일 작업을 명령어 한 줄로 처리" },
            { icon: "🤖", title: "AI 에이전트 구축", desc: "Make.com + LLM으로 24시간 자동으로 일하는 업무 시스템" },
          ].map((item, i) => (
            <div key={i} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 text-left hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="text-2xl block mb-3">{item.icon}</span>
              <h3 className="text-sm font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3" style={mk(0.5)}>
          <MagBtn href="#apply" variant="primary" size="lg" className="w-full sm:w-auto px-10">
            1기 합류하기
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </MagBtn>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            추천인 코드 보유자만 입장 가능
          </p>
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
    "🧠 LLM 업무 자동화", "⌨️ CLI 파일 자동화", "🔰 코딩 제로",
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
   SECTION — BEFORE / AFTER (Interactive tab switch)
   ═══════════════════════════════════════════════════════════════ */
function BeforeAfterSection() {
  const [tab, setTab] = useState("before");
  const data = {
    before: {
      emoji: "😩",
      title: "지금 당신의 하루",
      items: [
        { icon: "⏰", text: "매일 같은 엑셀 파일 수작업 반복" },
        { icon: "📋", text: "수십 페이지 회의록 직접 요약" },
        { icon: "📱", text: "릴스에서 AI 구경만 하고 저장" },
        { icon: "🌙", text: "기획서 야근, 보고서 야근, 또 야근" },
      ],
      color: "rose",
    },
    after: {
      emoji: "🚀",
      title: "리더스 AI랩 이후의 하루",
      items: [
        { icon: "⚡", text: "반복 업무는 LLM이 10분 안에 처리" },
        { icon: "🤖", text: "AI에게 말하면 문서·PPT 요약 완료" },
        { icon: "🎯", text: "보고서·카피·이미지를 AI가 즉시 생성" },
        { icon: "☀️", text: "퇴근 1시간 전, 오늘 할 일 끝" },
      ],
      color: "blue",
    },
  };
  const d = data[tab];
  const isAfter = tab === "after";

  return (
    <section className="py-16 sm:py-24 px-5 relative z-10">
      <div className="max-w-xl mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold tracking-widest uppercase mb-5">Before & After</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">눈으로 보는 AI와</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                손으로 쓰는 AI는 다릅니다.
              </span>
            </h2>
          </div>
        </FadeIn>

        {/* Toggle */}
        <FadeIn delay={0.1}>
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 mx-auto max-w-xs">
            {[
              { key: "before", label: "😩 지금", color: "rose" },
              { key: "after", label: "🚀 AI랩 이후", color: "blue" },
            ].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${tab === t.key ? (t.key === "before" ? "bg-white text-rose-600 shadow-md" : "bg-white text-blue-600 shadow-md") : "text-slate-400 hover:text-slate-600"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Content Card */}
        <FadeIn delay={0.15}>
          <div className={`rounded-3xl border-2 p-6 sm:p-8 transition-all duration-500 ${isAfter ? "border-blue-300 bg-gradient-to-b from-blue-50/60 to-white shadow-xl shadow-blue-100/50" : "border-rose-200 bg-gradient-to-b from-rose-50/60 to-white shadow-lg shadow-rose-100/30"}`}>
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">{d.emoji}</span>
              <h3 className={`text-lg sm:text-xl font-black ${isAfter ? "text-blue-700" : "text-rose-600"}`}>{d.title}</h3>
            </div>
            <div className="space-y-3">
              {d.items.map((item, i) => (
                <div key={`${tab}-${i}`} className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border transition-all duration-300 ${isAfter ? "border-blue-100" : "border-rose-100"}`}
                  style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.08}s both` }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-bold text-slate-700 leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
            {isAfter && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-3">
                <span className="text-xl mt-0.5">🔰</span>
                <p className="text-sm font-bold text-emerald-700 leading-relaxed">
                  코딩? IT 지식? 전혀 몰라도 됩니다.
                  <br />
                  <span className="text-emerald-600 font-medium">스마트폰 쓸 줄만 아시면 충분합니다.</span>
                </p>
              </div>
            )}
          </div>
        </FadeIn>
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
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
              <span className="text-xl flex-shrink-0">{c.icon}</span>
              <div>
                <div className="text-sm font-black text-slate-800 leading-snug">{c.title}</div>
                <div className="text-[11px] text-blue-600 font-bold mt-0.5">{c.period}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{c.desc}</div>
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase mb-5">Instructor</span>
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
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">영국 BNU 경영학 B.A.</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">캐나다 Concordia Uni 과정 수료</span>
              </div>
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
      icon: "🖥️", tag: "Level 0 · 무료", title: "디지털 업무 환경 구축",
      desc: "AI를 쓰기 전에 내 PC부터 정돈합니다. Windows 파일 구조 정리부터 Chrome AI 작업대 세팅까지 — 이후 모든 수업의 출발점.",
      modules: [
        { label: "실습 1", title: "Windows 폴더·파일 구조 정리", desc: "업무용 폴더 체계 설계 & 바탕화면 정리. AI를 올려놓을 깨끗한 환경 만들기" },
        { label: "실습 2", title: "CLI 개념 소개", desc: "터미널(CMD/PowerShell)이 무엇인지, 왜 쓰는지. 개념 이해 — 실습은 Level 3" },
        { label: "실습 3", title: "Chrome AI 작업대 구축", desc: "ChatGPT·Claude·Gemini 즐겨찾기 등록. 화면 분할 고정 (좌=문서, 우=AI)" },
        { label: "실습 4", title: "첫 AI 자동화 체험", desc: "LLM에게 '이 폴더 정리 명령어 짜줘' → 복사·실행. AI가 일한다는 것을 체감" },
      ],
      badge: "FREE · 2시간",
      badgeColor: "bg-slate-100 text-slate-700",
      color: "slate",
    },
    {
      icon: "🌱", tag: "Level 1+2 · 무료", title: "생성형 AI 업무 적용 기초",
      desc: "ChatGPT·Claude 첫 실습. 당일 결과물 2개를 손에 쥐고 돌아갑니다. 툴이 달라져도 통하는 AI 프롬프트 사고법을 익힙니다.",
      modules: [
        { label: "이론 · 30분",  title: "AI 프롬프트 설계 방법론", desc: "3단계 황금 공식 — [역할]+[상황]+[원하는 결과]. ChatGPT·Claude 어디서나 동일 적용" },
        { label: "실습 · 45분",  title: "LLM 문서 업무 활용", desc: "Word 파일 업로드 → 보고서 초안 자동 생성·수정. 내 업종 문서로 직접 실습" },
        { label: "실습 · 30분",  title: "생성형 AI 이미지·배너 제작", desc: "업종별 홍보 이미지 1장 완성. Gemini Imagen 활용, 핸드폰·PC 모두 가능" },
        { label: "루틴 · 15분",  title: "AI 작업대 활용 루틴 체득", desc: "Chrome 작업대 여는 방법 고정. 이 루틴이 이후 모든 수업의 시작" },
      ],
      badge: "FREE · 2시간",
      badgeColor: "bg-emerald-100 text-emerald-700",
      color: "emerald",
    },
    {
      icon: "⌨️", tag: "Level 3 · CLI + 사무 자동화", title: "CLI 활용 · LLM 기반 사무 자동화",
      desc: "직장인 고통 지점 TOP5를 직접 해결합니다. PPT 2.4시간→20분, 회의록 자동화, 이메일 초안, PowerShell 파일 자동화까지.",
      modules: [
        { label: "모듈 A", title: "PPT 자동 생성", desc: "감마(Gamma) + LLM 조합. 기획안 텍스트 → 완성 PPT. 2.4시간짜리 작업을 20분으로" },
        { label: "모듈 B", title: "보고서·회의록·이메일 자동화", desc: "Word 업로드→구조화·수정, 녹취→액션아이템 추출, 상황 설명→격식체 이메일 초안" },
        { label: "모듈 C", title: "LLM 프롬프트 라이브러리 구축", desc: "내 업종 반복 업무 프롬프트 저장소 제작. 다음 달부터 복사·붙여넣기만" },
        { label: "모듈 D", title: "PowerShell CLI 실전", desc: "파일 일괄 이름 변경, 폴더 자동 생성, 텍스트 일괄 처리. LLM이 스크립트 생성" },
        { label: "모듈 E", title: "LLM + CLI 연동 심화", desc: "'이런 작업 자동화해줘' 프롬프트 → LLM이 PowerShell 스크립트 생성 → 실행" },
        { label: "모듈 F", title: "Gemini CLI 입문", desc: "터미널에서 Gemini AI 직접 호출. 반복 질의 자동화, CLI 환경에서 AI 활용법" },
      ],
      badge: "6모듈 · 12시간",
      badgeColor: "bg-blue-100 text-blue-700",
      color: "blue",
    },
    {
      icon: "🤖", tag: "Level 4 · AI 에이전트 시스템", title: "AI 에이전트 기반 업무 시스템 구축",
      desc: "2026 에이전틱 AI 트렌드를 실무에 적용합니다. 계획·실행·점검을 자동화하는 AI 직원 시스템을 직접 만듭니다.",
      modules: [
        { label: "모듈 G~H", title: "맞춤형 LLM 에이전트 제작", desc: "업종별 24시간 응대·FAQ·견적 자동화 챗봇. 시스템 프롬프트 설계, 오답 방지 최적화" },
        { label: "모듈 I",   title: "Google Apps Script 자동화", desc: "LLM이 코드 생성, 수강생은 붙여넣고 실행. 반복 구글 시트·이메일 작업 자동화" },
        { label: "모듈 J~K", title: "Make.com 노코드 워크플로우", desc: "이메일 수신→LLM 분류→시트 기록→자동 회신 파이프라인. Office·Gmail·Drive 연결" },
        { label: "모듈 L~M", title: "AI 기반 홈페이지·브랜딩 제작", desc: "코딩 없이 비즈니스 랜딩 페이지 완성. AI로 로고·배너·SNS 템플릿 일괄 제작" },
      ],
      badge: "7모듈 · 18시간",
      badgeColor: "bg-violet-100 text-violet-700",
      color: "violet",
    },
    {
      icon: "🚀", tag: "Level 5 · AI 개발 환경", title: "AI 에이전트 개발 환경 입문 (Google Antigravity)",
      desc: "바이브코딩(Vibe Coding)으로 나만의 자동화 도구를 직접 만듭니다. 코딩 지식 없이도 LLM이 코드를 생성하고 실행합니다.",
      modules: [
        { label: "모듈 N", title: "Google Antigravity 설치 & 환경 세팅", desc: "VS Code 기반 AI IDE 설치. Gemini 3 Pro 탑재, Windows 무료. AI 작업대 최종 통합" },
        { label: "모듈 O", title: "바이브코딩 입문", desc: "자연어 명령 → LLM이 코드 생성·실행. '이 업무 자동화해줘' 한 문장으로 도구 제작" },
        { label: "모듈 P~Q", title: "본인 업무 맞춤 자동화 도구 제작", desc: "Level 0~4에서 배운 모든 내용 통합. 내 업무에 맞는 자동화 도구 1개 완성" },
      ],
      badge: "3모듈 · 심화",
      badgeColor: "bg-orange-100 text-orange-700",
      color: "orange",
    },
  ];
  const cMap = {
    slate:   { bg: "bg-slate-500",   light: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-600",   tag: "bg-slate-100 text-slate-700" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", tag: "bg-emerald-100 text-emerald-700" },
    blue:    { bg: "bg-blue-500",    light: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-600",    tag: "bg-blue-100 text-blue-700" },
    indigo:  { bg: "bg-indigo-500",  light: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-600",  tag: "bg-indigo-100 text-indigo-700" },
    violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-600",  tag: "bg-violet-100 text-violet-700" },
    orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-600",  tag: "bg-orange-100 text-orange-700" },
  };

  return (
    <section id="curriculum" className="py-16 sm:py-24 px-5 relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-5">Curriculum</span>
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
                      </div>
                      <h3 className={`text-base sm:text-lg font-black leading-snug ${isOpen ? "text-slate-800" : "text-slate-600"} transition-colors`}>{t.title}</h3>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Body */}
                  <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-4 sm:px-6 pb-6">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 pl-16">{t.desc}</p>
                      <div className="space-y-2 pl-16">
                        {t.modules.map((m, j) => (
                          <div key={j} className={`flex gap-3 p-3.5 rounded-2xl bg-white border ${c.border} border-opacity-50`}
                            style={{ animation: `fadeSlideIn 0.35s ease-out ${j * 0.07}s both` }}>
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
    { icon: "⏱", label: "시간당 단가", value: "10,000원" },
    { icon: "📦", label: "1모듈 (3시간)", value: "30,000원" },
    { icon: "📚", label: "유료 레벨 수", value: "3개" },
    { icon: "🎓", label: "전체 과정", value: "Level 0~5" },
  ];

  const levels = [
    {
      num: 1,
      title: "입문 패키지",
      price: "무료",
      priceNote: "Free",
      hours: "4시간 · Level 0+1+2",
      color: "emerald",
      modules: [
        { num: 0,     name: "디지털 업무 환경 구축",    desc: "Windows 정리 · Chrome AI 작업대 세팅" },
        { num: "1+2", name: "생성형 AI 업무 적용 기초", desc: "LLM 프롬프팅 · 문서 자동화 · 이미지 생성" },
      ],
    },
    {
      num: 2,
      title: "실무 패키지",
      price: "추후 공지",
      priceNote: "Level 0~3 포함",
      hours: "16시간 · Level 0~3",
      color: "blue",
      modules: [
        { num: 0,     name: "디지털 업무 환경 구축",      desc: "Windows 정리 · Chrome AI 작업대 세팅" },
        { num: "1+2", name: "생성형 AI 업무 적용 기초",   desc: "LLM 프롬프팅 · 문서 자동화 · 이미지 생성" },
        { num: 3,     name: "CLI 활용 · LLM 사무 자동화", desc: "PPT·보고서·회의록·PowerShell 자동화" },
      ],
    },
    {
      num: 3,
      title: "프리미엄 패키지",
      price: "추후 공지",
      priceNote: "Level 0~4 포함",
      hours: "34시간 · Level 0~4",
      color: "violet",
      modules: [
        { num: 0,     name: "디지털 업무 환경 구축",             desc: "Windows 정리 · Chrome AI 작업대 세팅" },
        { num: "1+2", name: "생성형 AI 업무 적용 기초",          desc: "LLM 프롬프팅 · 문서 자동화 · 이미지 생성" },
        { num: 3,     name: "CLI 활용 · LLM 사무 자동화",        desc: "PPT·보고서·회의록·PowerShell 자동화" },
        { num: 4,     name: "AI 에이전트 기반 업무 시스템 구축", desc: "LLM 에이전트 · Make.com · 홈페이지 제작" },
      ],
    },
    {
      num: 4,
      title: "마스터 패키지",
      price: "추후 공지",
      priceNote: "Level 0~5 전체",
      hours: "Level 0~5 전체",
      color: "orange",
      modules: [
        { num: "0~4", name: "프리미엄 패키지 전체 포함",   desc: "입문부터 AI 에이전트 시스템까지" },
        { num: 5,     name: "Google Antigravity 입문",     desc: "바이브코딩 · 나만의 자동화 도구 제작" },
      ],
    },
  ];

  const packages = [
    {
      icon: "📱",
      title: "핸드폰 패키지",
      levels: "Level 1 + 2",
      original: "120,000원",
      price: "99,000원",
      save: "21,000원 절약",
      best: false,
      color: "blue",
    },
    {
      icon: "💻",
      title: "핸드폰+PC 패키지",
      levels: "Level 1 ~ 3",
      original: "210,000원",
      price: "179,000원",
      save: "31,000원 절약",
      best: false,
      color: "indigo",
    },
    {
      icon: "🚀",
      title: "전체 완성 패키지",
      levels: "Level 1 ~ 4",
      original: "420,000원",
      price: "349,000원",
      save: "71,000원 절약",
      best: true,
      color: "violet",
    },
  ];

  const cMap = {
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-600", tag: "bg-emerald-100 text-emerald-700", glow: "shadow-emerald-100/50" },
    blue:    { bg: "bg-blue-500",    light: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-600",    tag: "bg-blue-100 text-blue-700",    glow: "shadow-blue-100/50" },
    indigo:  { bg: "bg-indigo-500",  light: "bg-indigo-50",  border: "border-indigo-300",  text: "text-indigo-600",  tag: "bg-indigo-100 text-indigo-700",  glow: "shadow-indigo-100/50" },
    violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  border: "border-violet-300",  text: "text-violet-600",  tag: "bg-violet-100 text-violet-700",  glow: "shadow-violet-100/50" },
    orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-300",  text: "text-orange-600",  tag: "bg-orange-100 text-orange-700",  glow: "shadow-orange-100/50" },
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-5 relative z-10 overflow-hidden">
      <AmbientGlow />
      <div className="relative z-10 max-w-2xl mx-auto">

        {/* ── 섹션 헤더 ── */}
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-5">Pricing</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">내 수준에 맞게,</span>
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">필요한 것만 골라 듣습니다.</span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base font-medium leading-relaxed">
              Level 1은 <strong className="text-emerald-600">무료</strong>로 시작합니다.
              <br />원하는 레벨까지만 수강해도 됩니다.
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
                        <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${isOpen ? c.text : "text-slate-400"}`}>Level {lv.num}</span>
                        {lv.num === 1 && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">FREE</span>}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-base sm:text-lg font-black leading-snug transition-colors ${isOpen ? "text-slate-800" : "text-slate-600"}`}>{lv.title}</h3>
                        <span className="text-xs text-slate-400 font-medium">{lv.hours}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-base sm:text-xl font-black ${lv.num === 1 ? "text-emerald-600" : c.text}`}>{lv.price}</div>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {packages.map((pkg, i) => {
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
                        ✨ BEST
                      </span>
                    </div>
                  )}
                  <div className="text-3xl mb-3 text-center">{pkg.icon}</div>
                  <h3 className="text-center font-black text-slate-800 text-sm sm:text-base mb-1">{pkg.title}</h3>
                  <p className={`text-center text-[11px] font-bold mb-4 ${c.text}`}>{pkg.levels}</p>
                  <div className="text-center mb-3">
                    <div className="text-xs text-slate-400 line-through font-medium mb-1">{pkg.original}</div>
                    <div className={`text-2xl sm:text-3xl font-black ${c.text}`}>{pkg.price}</div>
                  </div>
                  <div className={`text-center text-[11px] font-black px-3 py-1.5 rounded-full ${c.light} ${c.text}`}>
                    {pkg.save}
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
            {/* 문의하기 */}
            <a href="https://open.kakao.com/o/gKnC1Eli" target="_blank" rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#FEF9C3] border-2 border-yellow-200 flex items-start gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#FEE500] flex items-center justify-center text-xl flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.85.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
              </div>
              <div>
                <div className="text-sm font-black text-[#3C1E1E] mb-1 group-hover:underline">카카오로 수강 문의하기 →</div>
                <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                  패키지 상담·일정 안내·할인 문의는<br />
                  오픈채팅방으로 편하게 연락 주세요.
                </p>
              </div>
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 font-medium">
            💡 모든 수강료에는 <strong className="text-slate-600">현장 직접 세팅</strong>이 포함됩니다.
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
  const [active, setActive] = useState(0);
  const steps = [
    { icon: "🔗", num: "01", title: "추천인 코드 받기", desc: "기존 멤버나 SNS를 통해 추천인 코드를 받으세요." },
    { icon: "💬", num: "02", title: "오픈채팅 입장", desc: "카카오 오픈채팅방에 코드와 함께 입장합니다." },
    { icon: "📋", num: "03", title: "레벨 상담", desc: "현재 수준과 목표에 맞는 맞춤 트랙을 선택합니다." },
    { icon: "🚀", num: "04", title: "현장 세팅", desc: "대전 교육장에서 내 기기에 AI를 직접 설치합니다." },
  ];
  useEffect(() => { const t = setInterval(() => setActive((p) => (p + 1) % steps.length), 3500); return () => clearInterval(t); }, []);

  return (
    <section className="py-16 sm:py-24 px-5 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl relative z-10">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold tracking-widest uppercase mb-5">Process</span>
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
                <div className={`text-[10px] font-black tracking-widest mb-1 transition-colors ${i === active ? "text-blue-500" : "text-slate-300"}`}>STEP {s.num}</div>
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
  const benefits = [
    {
      icon: "🔄",
      title: "끝나지 않는 AI 업데이트",
      desc: "AI는 매주 진화합니다. 새로운 기능, 새로운 도구가 나올 때마다 커뮤니티에서 가장 먼저 정리해 공유합니다.",
    },
    {
      icon: "📚",
      title: "정기 스터디 & 워크숍",
      desc: "월 2회 이상 오프라인 스터디를 진행합니다. 혼자 하면 막히는 것도 함께하면 10분이면 해결됩니다.",
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-xs font-bold tracking-widest uppercase mb-5">Community</span>
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
              이제는 같은 목표를 가진 대전 사람들과
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
  const [form, setForm] = useState({ name: "", role: "", phone: "", task: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveCount, setLiveCount] = useState(null);
  const TOTAL = 100;

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

  return (
    <section id="apply" className="py-16 sm:py-24 px-5 relative z-10 overflow-hidden">
      <AmbientGlow />
      <div className="relative z-10 max-w-lg mx-auto">
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-5">Apply Now</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight">
              <span className="block">대전 최초 AI 실무 커뮤니티</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">1기 멤버를 모집합니다.</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed font-medium">
              가장 먼저 합류한 분들이
              <br className="sm:hidden" />{" "}가장 큰 혜택을 받습니다.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SeatBar total={TOTAL} filled={liveCount ?? 3} className="mb-6 px-1" />
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
            {!submitted ? (
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
                <MagBtn href="https://open.kakao.com/o/gKnC1Eli" variant="kakao" size="md">
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
            <MagBtn href="https://open.kakao.com/o/gKnC1Eli" variant="kakao" size="md" className="w-full sm:w-auto">
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
    1: { level: "Level 1", emoji: "🌱", title: "무료 체험부터 시작하세요!", desc: "아직 AI가 낯설어도 괜찮습니다. Level 1 무료 체험에서 강사와 함께 처음부터 차근차근 세팅해 드립니다.", color: "emerald", price: "무료" },
    2: { level: "Level 1 → 2", emoji: "📱", title: "핸드폰 패키지 추천!", desc: "스마트폰은 익숙하시죠? Level 1 무료 체험 후 Level 2로 홍보·영상·서류 자동화까지 바로 연결하세요.", color: "blue", price: "99,000원" },
    3: { level: "Level 1 → 3", emoji: "💻", title: "핸드폰+PC 패키지 추천!", desc: "PC까지 활용하시면 문서·보고서 자동화 파이프라인 구축이 가능합니다. 야근이 없어집니다.", color: "indigo", price: "179,000원" },
    4: { level: "Level 1 → 4", emoji: "🤖", title: "전체 완성 패키지 추천!", desc: "Gemini Gems 챗봇부터 홈페이지·숏폼 채널까지. AI가 진짜 직원이 되는 레벨입니다.", color: "violet", price: "349,000원" },
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-5">Level Quiz</span>
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
              <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">Question {step + 1} / {questions.length}</p>
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
   NAV — 모바일 최적화
   ═══════════════════════════════════════════════════════════════ */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm py-3" : "bg-transparent py-4 sm:py-5"}`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between px-5">
        <a href="https://risegen.kr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="LEADERS AI LABS 로고" width={160} height={40} className="h-7 sm:h-8 w-auto object-contain hover:opacity-80 transition-opacity" priority />
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold">1기 모집중</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#pricing" className="hidden sm:inline-block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">수강료</a>
          <MagBtn href="#apply" variant="primary" size="sm" className="text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
            신청하기
          </MagBtn>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING MOBILE CTA
   ═══════════════════════════════════════════════════════════════ */
function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const fn = () => setVisible(window.scrollY > 500); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <div className={`fixed bottom-0 inset-x-0 z-40 sm:hidden transition-all duration-400 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-4 py-3 flex gap-2 shadow-xl">
        <a href="https://open.kakao.com/o/gKnC1Eli" target="_blank" rel="noopener noreferrer"
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-5">Vibe Check</span>
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
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function LeadersAILabs() {
  return (
    <main className="min-h-screen relative selection:bg-blue-200 selection:text-blue-900">
      <NavBar />
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

      <footer className="py-10 bg-slate-900 border-t border-slate-800 text-center relative z-20">
        <div className="max-w-5xl mx-auto px-5 flex flex-col items-center">
          <a href="https://risegen.kr" target="_blank" rel="noopener noreferrer">
            <Image src="/logo.png" alt="LEADERS AI LABS 로고" width={180} height={45} className="h-8 w-auto object-contain brightness-0 invert mb-3 hover:opacity-80 transition-opacity" />
          </a>
          <p className="text-sm text-slate-500 mb-1">대전광역시 중구 대종로 417-1번지</p>
          <p className="text-xs text-slate-600">AI(DX)교육 전문 · LLM 기반 사무 업무 자동화 전문 교육기관</p>
          <div className="w-12 h-px bg-slate-700 my-4" />
          <p className="text-xs text-slate-600">© 2025 LEADERS AI LABS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
