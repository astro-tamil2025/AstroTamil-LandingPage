import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") || "").trim();
  if (!city) {
    return new Response(JSON.stringify({ error: "city is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", city);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const resp = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AstroTamil/1.0 (contact: support@example.com)",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: `Geocode failed: ${resp.status} ${text}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    const arr = (await resp.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    if (!arr?.length) {
      return new Response(JSON.stringify({ error: "No results" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { lat, lon, display_name } = arr[0];
    return new Response(JSON.stringify({ lat, lon, display_name }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Geocode timeout" : e?.message || "Geocode error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


