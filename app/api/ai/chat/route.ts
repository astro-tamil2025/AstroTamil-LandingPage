import { NextRequest } from "next/server";
import { OpenRouter } from "@openrouter/sdk";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, model, lang } = (await req.json()) as {
      messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
      model?: string;
      lang?: "ta" | "en";
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages[] required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const openRouter = new OpenRouter({
      apiKey,
    });

    const ALLOWED = [
      "birth details", "nakshatra", "rasi", "zodiac", "chandra rasi", "soorya rasi",
      "daily horoscope", "horoscope", "transit", "planet positions", "muhurat",
      "compatibility", "dosha", "rahu", "ketu", "shani", "guru", "sukra", "budha",
      "chandra", "soorya", "ayanamsa",
      // Tamil hints
      "ஜாதகம்", "ராசி", "நக்ஷத்திரம்", "சந்திர ராசி", "சூர்ய ராசி", "இன்றைய பலன்", "கிரக பெயர்கள்",
    ];

    const systemGuard = (lang === "ta"
      ? "நீங்கள் AstroBot. ஜோதிடம் தொடர்பான கேள்விகளுக்கு மட்டும் பதிலளிக்கவும். கீழ்க்கண்ட பகுதிகளிலேயே பதில் அனுமதி: பிறந்த விவரங்கள்/நக்ஷத்திரம்/ராசி/இன்றைய பலன்/கிரக சஞ்சாரம்/முஹூர்த்தம்/இணக்கம்/தோஷங்கள். இதற்கு வெளியே இருப்பின் சுருக்கமாக மறுக்கவும்: ‘ஜோதிடம் தொடர்பான கேள்விகளுக்கு மட்டும் பதிலளிக்கிறேன்.’"
      : "You are AstroBot. Only answer astrology questions in these domains: birth details/nakshatra/rasi/zodiac/daily horoscope/transits/muhurta/compatibility/doshas/planet positions. If outside scope, briefly refuse: 'I only answer astrology-related questions.'");

    const completion = await openRouter.chat.send(
      {
        model: model || "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemGuard },
          ...messages.filter(Boolean),
        ],
        stream: false,
      },
      {
        headers: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Nakshatra Talks",
        },
      }
    );

    const content = completion?.choices?.[0]?.message?.content ?? "";
    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    const status = err?.status || 500;
    const message = err?.message || "OpenRouter request failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { "Content-Type": "application/json" } }
    );
  }
}


