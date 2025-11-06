// Small helper to manage Prokerala OAuth token and API calls

let cachedAccessToken: string | null = null;
let tokenExpiryEpochMs = 0;

async function fetchAccessToken(): Promise<string> {
  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PROKERALA_CLIENT_ID or PROKERALA_CLIENT_SECRET");
  }

  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiryEpochMs - 15_000) {
    return cachedAccessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  let resp: Response;
  try {
    resp = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      // Avoid Next.js caching for token requests
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Token request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch access token: ${resp.status} ${text}`);
  }

  const data: { access_token: string; token_type: string; expires_in: number } = await resp.json();
  cachedAccessToken = data.access_token;
  tokenExpiryEpochMs = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

export async function getDailyPrediction(params: { sign: string; datetime: string }) {
  const accessToken = await fetchAccessToken();

  const url = new URL("https://api.prokerala.com/v2/horoscope/daily");
  // API requires lowercase sign enum per docs
  url.searchParams.set("sign", params.sign.toLowerCase());
  // Ensure datetime is URL encoded externally safe, but URL will handle it
  url.searchParams.set("datetime", params.datetime);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let resp: Response;
  try {
    const requestUrl = url.toString();
    resp = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Daily prediction request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prokerala daily prediction failed: ${resp.status} ${text}`);
  }

  return resp.json();
}


export type BirthDetailsParams = {
  ayanamsa: 1 | 3 | 5; // 1: Lahiri, 3: Raman, 5: KP
  coordinates: string; // "lat,lng" e.g. "10.214747,78.097626"
  datetime: string; // ISO 8601, URL-safe (we will use URL to encode)
  la?: "en" | "ta" | "ml" | "hi";
};

export async function getBirthDetails(params: BirthDetailsParams) {
  const accessToken = await fetchAccessToken();

  const url = new URL("https://api.prokerala.com/v2/astrology/birth-details");
  url.searchParams.set("ayanamsa", String(params.ayanamsa));
  url.searchParams.set("coordinates", params.coordinates);
  // URL handles encoding of + in timezone if provided in the string
  url.searchParams.set("datetime", params.datetime);
  if (params.la) url.searchParams.set("la", params.la);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let resp: Response;
  try {
    resp = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Birth details request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prokerala birth details failed: ${resp.status} ${text}`);
  }

  return resp.json();
}

export type BirthChartParams = {
  ayanamsa: 1 | 3 | 5; // 1: Lahiri, 3: Raman, 5: KP
  coordinates: string; // "lat,lng" e.g. "10.214747,78.097626"
  datetime: string; // ISO 8601, URL-safe
  chart_type: "rasi"; // Fixed to rasi
  chart_style: "south-indian"; // Fixed to south-indian
  format: "svg"; // Fixed to svg
  la?: "en" | "ta" | "ml" | "hi";
};

export async function getBirthChart(params: BirthChartParams): Promise<string> {
  const accessToken = await fetchAccessToken();

  const url = new URL("https://api.prokerala.com/v2/astrology/chart");
  url.searchParams.set("ayanamsa", String(params.ayanamsa));
  url.searchParams.set("coordinates", params.coordinates);
  url.searchParams.set("datetime", params.datetime);
  url.searchParams.set("chart_type", params.chart_type);
  url.searchParams.set("chart_style", params.chart_style);
  url.searchParams.set("format", params.format);
  if (params.la) url.searchParams.set("la", params.la);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let resp: Response;
  try {
    resp = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Birth chart request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prokerala birth chart failed: ${resp.status} ${text}`);
  }

  // Return SVG as text
  return resp.text();
}


