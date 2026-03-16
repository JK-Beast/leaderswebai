import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// Vercel, Netlify 등 서버리스 환경에서는 /tmp만 쓰기 가능합니다.
const IS_SERVERLESS = process.env.VERCEL === "1" || !!process.env.VERCEL || process.env.NETLIFY === "true" || !!process.env.NETLIFY || !!process.env.AWS_REGION;
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "applicants.json");
const TMP_DATA_PATH = "/tmp/applicants.json";
const DATA_PATH = IS_SERVERLESS ? TMP_DATA_PATH : LOCAL_DATA_PATH;
const TOTAL_SEATS = 100;

function readApplicants() {
  try {
    // 서버리스 환경: /tmp에 파일이 없으면 프로젝트 data 폴더에서 초기 데이터 복사
    if (IS_SERVERLESS && !fs.existsSync(TMP_DATA_PATH)) {
      try {
        const seed = fs.readFileSync(LOCAL_DATA_PATH, "utf-8");
        fs.writeFileSync(TMP_DATA_PATH, seed, "utf-8");
        return JSON.parse(seed);
      } catch {
        // seed 파일도 없으면 빈 배열로 시작
        fs.writeFileSync(TMP_DATA_PATH, "[]", "utf-8");
        return [];
      }
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeApplicants(data) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function sendEmail(applicant, currentCount) {
  const user = process.env.EMAIL_USER;
  // Gmail 앱 비밀번호의 공백(스페이스) 제거 (오류 방지)
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : undefined;
  const to = process.env.NOTIFY_EMAIL;

  if (!user || !pass || !to) {
    console.error("환경변수 누락:", { user: !!user, pass: !!pass, to: !!to });
    throw new Error("환경변수(EMAIL_USER, EMAIL_PASS, NOTIFY_EMAIL)가 설정되지 않았습니다.");
  }

  // 확실한 전송을 위해 명시적인 옵션 사용
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const remaining = TOTAL_SEATS - currentCount;

  try {
    const info = await transporter.sendMail({
      from: `"LEADERS AI LABS" <${user}>`,
      to,
      subject: `🚀 [새 신청] ${applicant.name}님이 1기에 신청했습니다! (${currentCount}/${TOTAL_SEATS}명)`,
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
    return true;
  } catch (error) {
    console.error("sendMail 내부 에러:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, phone, task } = body;

    // 유효성 검사
    if (!name || !role || !phone || !task) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
    }

    // 중복 체크 (연락처 기준)
    const applicants = readApplicants();
    const isDuplicate = applicants.some((a) => a.phone === phone);
    if (isDuplicate) {
      return NextResponse.json({ error: "이미 신청된 연락처입니다.", count: applicants.length }, { status: 409 });
    }

    // 정원 초과 체크
    if (applicants.length >= TOTAL_SEATS) {
      return NextResponse.json({ error: "모집이 마감되었습니다.", count: applicants.length }, { status: 410 });
    }

    // 저장
    const newApplicant = { name, role, phone, task, date: new Date().toISOString() };
    applicants.push(newApplicant);
    
    // 파일 시스템 쓰기가 실패하더라도 (Vercel 권한 문제, OneDrive 잠금 등)
    // 사용자에게 에러를 보여주지 않고 메모리상 기록만 남기도록 예외 처리
    try {
      writeApplicants(applicants);
    } catch (writeError) {
      console.warn("파일 저장 실패(서버리스/권한 이슈):", writeError.message);
      // 중요: 파일 저장이 실패하더라도 서버 응답은 성공으로 처리하도록 흐름을 계속 진행
    }

    // 이메일 알림
    // 서버리스 환경에서는 백그라운드 비동기 함수가 종료될 수 있으므로 await로 완료를 기다립니다.
    // 이메일 발송에 실패하면 사용자에게도 오류를 반환하여, 시스템 담당자가 알림을 받지 못하는 사태를 방지합니다.
    try {
      await sendEmail(newApplicant, applicants.length);
    } catch (err) {
      console.error("이메일 발송 실패:", err.message);
      return NextResponse.json(
        { error: "이메일 알림 발송에 실패했습니다. (환경변수 설정 또는 비밀번호를 다시 확인해주세요.)" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${name}님의 신청이 완료되었습니다!`,
      count: applicants.length,
    });
  } catch (err) {
    console.error("신청 처리 오류 상세 내역:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
