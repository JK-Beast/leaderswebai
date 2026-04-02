import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const TOTAL_SEATS = 100;
const BASE_COUNT = 0;
const REDIS_KEY_LIST = "chungnam_applicants";

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const count = await redis.llen(REDIS_KEY_LIST);
    return NextResponse.json({ count: count + BASE_COUNT, total: TOTAL_SEATS });
  } catch (err) {
    console.error("count 조회 오류:", err.message);
    return NextResponse.json({ count: BASE_COUNT, total: TOTAL_SEATS });
  }
}
