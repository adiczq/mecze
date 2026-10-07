import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteMatchVideo, setMatchVideo } from "@/lib/match-videos";

function isValidYoutubeUrl(value: string) {
  try {
    const url = new URL(value);

    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    return (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const matchId = String(formData.get("matchId") || "").trim();

  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();

  if (!matchId) {
    return NextResponse.json({ error: "Brak ID meczu." }, { status: 400 });
  }

  if (!youtubeUrl) {
    await deleteMatchVideo(matchId);

    return NextResponse.json({
      ok: true,
      youtubeUrl: "",
    });
  }

  if (!isValidYoutubeUrl(youtubeUrl)) {
    return NextResponse.json(
      { error: "Podaj prawidłowy link do YouTube." },
      { status: 400 }
    );
  }

  await setMatchVideo(matchId, youtubeUrl);

  return NextResponse.json({
    ok: true,
    youtubeUrl,
  });
}
