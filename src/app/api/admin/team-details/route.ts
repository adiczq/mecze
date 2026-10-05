import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const TEAM_API =
  "https://competition-api-pro2.laczynaspilka.pl/api/bus/competition/v1/teams";

export async function GET(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  if (!teamId) {
    return NextResponse.json(
      { error: "Brak parametru teamId" },
      { status: 400 }
    );
  }

  const response = await fetch(`${TEAM_API}/${encodeURIComponent(teamId)}`, {
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Błąd competition API",
        status: response.status,
        response: text,
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
