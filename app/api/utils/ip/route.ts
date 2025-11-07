import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Get IP from various headers (for different hosting providers)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  const ip = forwarded?.split(",")[0]?.trim() || 
             realIp || 
             cfConnectingIp || 
             "unknown";

  return new Response(JSON.stringify({ ip }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

