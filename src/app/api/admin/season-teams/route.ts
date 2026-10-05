import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const PROXY_URL = process.env.PZPN_PROXY_URL || "https://proxy.adiczq.dev";

const CLUB_ID = "49bf1917-1ba8-4695-8737-1d552adf0da5";

export async function GET(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proxySecret = process.env.PROXY_SECRET;

  if (!proxySecret) {
    return NextResponse.json({ error: "Brak PROXY_SECRET" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Brak parametru season" },
      { status: 400 }
    );
  }

  const endpoint =
    `${PROXY_URL}/pzpn/clubs/${CLUB_ID}/seasons/` +
    `${encodeURIComponent(season)}/teams`;

  const response = await fetch(endpoint, {
    headers: {
      "x-proxy-secret": proxySecret,
    },
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Błąd proxy/PZPN",
        status: response.status,
        response: text,
        endpoint,
      },
      { status: response.status }
    );
  }

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({
      raw: text,
    });
  }
}
