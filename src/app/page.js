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
          <strong className="text-slate-700">Gemini + Workflow</strong> 기반으로
          <br />
          <strong className="text-slate-700">내 스마트폰, 내 노트북</strong>에
          <br className="sm:hidden" />{" "}
          당장 내일 쓸 AI 환경을 세팅해 드립니다.
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
            { icon: "📱", title: "스마트폰 AI 세팅", desc: "Gemini 음성 비서를 내 폰에 직접 설치" },
            { icon: "📂", title: "업무 자동화 구축", desc: "반복 문서 작업을 Workflow로 10분 컷" },
            { icon: "🎯", title: "마케팅 콘텐츠 생성", desc: "릴스·카피·이미지를 AI로 즉시 제작" },
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
    "📱 스마트폰 AI 비서", "⚡ 10분 Workflow", "🔰 코딩 제로",
    "📂 문서 자동 요약", "🎯 릴스 자동 기획", "✍️ AI 카피라이팅",
    "🏢 기업 DX 맞춤", "📊 데이터 분석", "🎬 콘텐츠 자동화",
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
        { icon: "⚡", text: "반복 업무는 Workflow가 자동 처리" },
        { icon: "🤖", text: "Gemini에게 말하면 문서 요약 완료" },
        { icon: "🎯", text: "릴스·카피·이미지를 AI가 즉시 생성" },
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
   CURRICULUM — Interactive Accordion (모바일에 최적)
   ═══════════════════════════════════════════════════════════════ */
function CurriculumSection() {
  const [openIdx, setOpenIdx] = useState(0);
  const tracks = [
    {
      icon: "📱", tag: "AI 비서", title: "내 손안의 AI 비서 세팅",
      desc: "스마트폰 하나로 실시간 업무를 처리할 수 있도록 Gemini 기반 AI 비서를 당신의 기기에 맞춤 세팅합니다.",
      features: ["Gemini 음성 명령으로 일정·메모 즉시 등록", "매일 쏟아지는 메일·뉴스 핵심만 자동 요약", "외국어 미팅도 실시간 통역기로 해결", "출퇴근길에도 AI가 업무를 미리 정리"],
      color: "blue",
    },
    {
      icon: "📂", tag: "문서 자동화", title: "반복 문서 작업, 10분 컷",
      desc: "수십 페이지 회의록, HWP 기획서, 복잡한 엑셀 데이터를 Workflow 파이프라인으로 자동 처리합니다.",
      features: ["HWP·PPT·PDF 문서 자동 분류 및 정리", "내 말투에 맞춘 맞춤형 자동 요약 시스템", "계약서 핵심 조항 3초 만에 추출", "폴더·파일 구조 AI가 알아서 관리"],
      color: "indigo",
    },
    {
      icon: "🎯", tag: "AI 마케팅", title: "SNS 콘텐츠 자동화 공장",
      desc: "소상공인·1인 기업도 디자이너·마케터 없이 고품질 SNS 콘텐츠를 AI로 즉시 만들 수 있도록 세팅합니다.",
      features: ["조회수 터지는 릴스 스크립트 역기획", "클릭을 부르는 SNS 카피 자동 생성", "상세페이지 레이아웃 AI 제작", "상품 이미지까지 AI로 완성"],
      color: "violet",
    },
  ];
  const cMap = {
    blue: { bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", tag: "bg-blue-100 text-blue-700" },
    indigo: { bg: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600", tag: "bg-indigo-100 text-indigo-700" },
    violet: { bg: "bg-violet-500", light: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", tag: "bg-violet-100 text-violet-700" },
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
                내 기기에 직접 세팅합니다.
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base font-medium leading-relaxed">
              수업을 듣고 돌아가는 게 아닙니다.
              <br />
              교육이 끝나면 <strong className="text-slate-700">내 폰, 내 노트북</strong>에
              <br className="sm:hidden" />{" "}AI 도구가 세팅되어 있습니다.
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
                      <span className={`text-[10px] font-black tracking-widest uppercase ${isOpen ? c.text : "text-slate-400"} transition-colors`}>{t.tag}</span>
                      <h3 className={`text-base sm:text-lg font-black leading-snug ${isOpen ? "text-slate-800" : "text-slate-600"} transition-colors`}>{t.title}</h3>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Body */}
                  <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 sm:px-6 pb-6">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 pl-16">{t.desc}</p>
                      <div className="space-y-2.5 pl-16">
                        {t.features.map((f, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white shadow-sm ${c.bg}`}>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="text-sm font-bold text-slate-700 leading-snug">{f}</span>
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
            <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed">
              이제는 같은 목표를 가진 대전 사람들과
              <br className="sm:hidden" />{" "}
              함께 가세요. 포기할 수가 없습니다.
            </p>
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
    fetch("/api/count")
      .then((r) => r.json())
      .then((d) => setLiveCount(d.count))
      .catch(() => setLiveCount(3));
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
        <MagBtn href="#apply" variant="primary" size="sm" className="text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
          신청하기
        </MagBtn>
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
      <CurriculumSection />
      <ProcessSection />
      <GallerySection />
      <CommunitySection />
      <ApplicationSection />
      <FloatingCTA />

      <footer className="py-10 bg-slate-900 border-t border-slate-800 text-center relative z-20">
        <div className="max-w-5xl mx-auto px-5 flex flex-col items-center">
          <a href="https://risegen.kr" target="_blank" rel="noopener noreferrer">
            <Image src="/logo.png" alt="LEADERS AI LABS 로고" width={180} height={45} className="h-8 w-auto object-contain brightness-0 invert mb-3 hover:opacity-80 transition-opacity" />
          </a>
          <p className="text-sm text-slate-500 mb-1">대전광역시 중구 대종로 417-1번지</p>
          <p className="text-xs text-slate-600">AI(DX)교육 전문 · Gemini + Workflow 기반</p>
          <div className="w-12 h-px bg-slate-700 my-4" />
          <p className="text-xs text-slate-600">© 2025 LEADERS AI LABS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
