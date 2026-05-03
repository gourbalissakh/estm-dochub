import { NextRequest, NextResponse } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, namespace: string, limit = 10, windowMs = 60_000) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return NextResponse.json({ error: "Trop de requetes, reessayez dans une minute." }, { status: 429 });
  }
  return null;
}
