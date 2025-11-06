import { NextRequest, NextResponse } from "next/server";
import { getBirthChart } from "@/lib/prokerala";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ayanamsaRaw = searchParams.get("ayanamsa");
    const coordinates = searchParams.get("coordinates");
    const datetime = searchParams.get("datetime");
    const la = searchParams.get("la") as "en" | "ta" | "ml" | "hi" | null;

    if (!ayanamsaRaw || !coordinates || !datetime) {
      return NextResponse.json(
        { error: "Missing required query params: ayanamsa, coordinates, datetime" },
        { status: 400 }
      );
    }

    const ayanamsaNum = Number(ayanamsaRaw);
    if (![1, 3, 5].includes(ayanamsaNum)) {
      return NextResponse.json(
        { error: "ayanamsa must be one of 1 (Lahiri), 3 (Raman), 5 (KP)" },
        { status: 400 }
      );
    }

    // Basic validation for coordinates "lat,lng"
    if (!/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(coordinates)) {
      return NextResponse.json(
        { error: "coordinates must be in 'lat,lng' format" },
        { status: 400 }
      );
    }

    // Sandbox note: Prokerala sandbox accepts only January 1 (any year/time)
    // If PROKERALA_SANDBOX=true, coerce the date to Jan 1 while preserving year, time and offset
    let dt = datetime;
    if (process.env.PROKERALA_SANDBOX === "true") {
      const m = dt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}:\d{2})([+\-]\d{2}:\d{2}|Z)$/);
      if (m) {
        const year = m[1];
        const time = m[4];
        const offset = m[5];
        dt = `${year}-01-01T${time}${offset}`;
      }
    }

    // Fixed parameters: chart_type=rasi, chart_style=south-indian, format=svg
    const svg = await getBirthChart({
      ayanamsa: ayanamsaNum as 1 | 3 | 5,
      coordinates: coordinates.trim(),
      datetime: dt,
      chart_type: "rasi",
      chart_style: "south-indian",
      format: "svg",
      la: la ?? undefined,
    });

    // Return SVG as text with proper content type
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (err) {
    console.error("Error fetching birth chart:", err);
    return NextResponse.json(
      { error: "Failed to fetch birth chart" },
      { status: 500 }
    );
  }
}

