import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Vercel, Netlify 등 서버리스 환경에서는 /tmp만 쓰기 가능합니다.
const IS_SERVERLESS = process.env.VERCEL === "1" || !!process.env.VERCEL || process.env.NETLIFY === "true" || !!process.env.NETLIFY || !!process.env.AWS_REGION;
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "applicants.json");
const TMP_DATA_PATH = "/tmp/applicants.json";
const DATA_PATH = IS_SERVERLESS ? TMP_DATA_PATH : LOCAL_DATA_PATH;

function readApplicants() {
  try {
    // 서버리스 환경: /tmp에 파일이 없으면 프로젝트 data 폴더에서 초기 데이터 복사
    if (IS_SERVERLESS && !fs.existsSync(TMP_DATA_PATH)) {
      try {
        const seed = fs.readFileSync(LOCAL_DATA_PATH, "utf-8");
        fs.writeFileSync(TMP_DATA_PATH, seed, "utf-8");
        return JSON.parse(seed);
      } catch {
        fs.writeFileSync(TMP_DATA_PATH, "[]", "utf-8");
        return [];
      }
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.length > 0 ? parsed : Array(26).fill({})) : Array(26).fill({});
  } catch {
    return Array(26).fill({});
  }
}

export async function GET() {
  const applicants = readApplicants();
  return NextResponse.json({ count: applicants.length, total: 100 });
}
