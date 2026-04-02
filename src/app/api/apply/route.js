import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";

const TOTAL_SEATS = 100;
const BASE_COUNT = 0;
const REDIS_KEY_LIST  = "chungnam_applicants";
const REDIS_KEY_PHONES = "chungnam_phones";

async function sendEmail(applicant, currentCount) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : undefined;
  const to = process.env.NOTIFY_EMAIL;

  if (!user || !pass || !to) {
    throw new Error("환경변수(EMAIL_USER, EMAIL_PASS, NOTIFY_EMAIL)가 설정되지 않았습니다.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const remaining = TOTAL_SEATS - currentCount;

  const info = await transporter.sendMail({
    from: `"LEADERS AI LABS" <${user}>`,
    to,
    subject: `🚀 [충남 1기 신청] ${applicant.name}님이 신청했습니다! (${currentCount}/${TOTAL_SEATS}명)`,
    html: `
      <div style="font-family:'Pretendard',sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8faff;border-radius:16px;">
        <h2 style="color:#1e293b;margin-bottom:24px;">🎉 새로운 1기 신청이 접수되었습니다</h2>
        <div style="background:white;border-radius:12px;padding:24px;border:1px solid #e2e8f0;margin-bottom:20px;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px 0;color:#64748b;width:100px;">이름</td><td style="padding:8px 0;color:#1e293b;font-weight:700;">${applicant.name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">소속/직무</td><td style="padding:8px 0;color:#1e293b;font-weight:700;">${applicant.role}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">연락처</td><td style="padding:8px 0;color:#1e293b;font-weight:700;">${applicant.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">자동화 업무</td><td style="padding:8px 0;color:#1e293b;font-weight:700;">${applicant.task}</td></tr>
          </table>
        </div>
        <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:12px;padding:20px;text-align:center;color:white;margin-bottom:16px;">
          <div style="font-size:32px;font-weight:900;">${currentCount}<span style="font-size:16px;opacity:0.7;">/${TOTAL_SEATS}명</span></div>
          <div style="font-size:13px;opacity:0.8;margin-top:4px;">현재 신청 현황 · 잔여 ${remaining}석</div>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;">신청 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
      </div>
    `,
  });

  console.log("이메일 발송 성공:", info.messageId);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, phone, task } = body;

    if (!name || !role || !phone || !task) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
    }

    const redis = Redis.fromEnv();

    // 중복 체크 (연락처 기준)
    const isDuplicate = await redis.sismember(REDIS_KEY_PHONES, phone);
    if (isDuplicate) {
      const count = await redis.llen(REDIS_KEY_LIST);
      return NextResponse.json({ error: "이미 신청된 연락처입니다.", count: count + BASE_COUNT }, { status: 409 });
    }

    // 정원 초과 체크
    const currentLen = await redis.llen(REDIS_KEY_LIST);
    if (currentLen + BASE_COUNT >= TOTAL_SEATS) {
      return NextResponse.json({ error: "모집이 마감되었습니다.", count: currentLen + BASE_COUNT }, { status: 410 });
    }

    // Redis에 저장 (원자적)
    const newApplicant = { name, role, phone, task, date: new Date().toISOString() };
    await redis.lpush(REDIS_KEY_LIST, JSON.stringify(newApplicant));
    await redis.sadd(REDIS_KEY_PHONES, phone);

    const newCount = currentLen + 1 + BASE_COUNT;

    // 이메일 알림 (실패해도 신청은 완료 처리)
    sendEmail(newApplicant, newCount).catch((err) =>
      console.error("이메일 발송 실패:", err.message)
    );

    return NextResponse.json({
      success: true,
      message: `${name}님의 신청이 완료되었습니다!`,
      count: newCount,
    });
  } catch (err) {
    console.error("신청 처리 오류:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
