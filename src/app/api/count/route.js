import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const TOTAL_SEATS = 100;
const BASE_COUNT = 31; // 시스템 도입 이전 수기 집계 인원

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const count = await redis.llen("applicants");
    return NextResponse.json({ count: count + BASE_COUNT, total: TOTAL_SEATS });
  } catch (err) {
    console.error("count 조회 오류:", err.message);
    // Redis 미설정 또는 오류 시 BASE_COUNT 반환
    return NextResponse.json({ count: BASE_COUNT, total: TOTAL_SEATS });
  }
}
