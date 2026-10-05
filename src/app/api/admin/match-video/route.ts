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
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();

  const matchId = String(formData.get("matchId") || "").trim();

  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();

  if (!matchId) {
    return NextResponse.json({ error: "Brak ID meczu." }, { status: 400 });
  }

  if (!youtubeUrl) {
    await deleteMatchVideo(matchId);

    const url = new URL("/admin", request.url);
    url.searchParams.set("saved", "1");

    return NextResponse.redirect(url, 303);
  }

  if (!isValidYoutubeUrl(youtubeUrl)) {
    const url = new URL("/admin", request.url);
    url.searchParams.set("error", "youtube");

    return NextResponse.redirect(url, 303);
  }

  await setMatchVideo(matchId, youtubeUrl);

  const url = new URL("/admin", request.url);
  url.searchParams.set("saved", "1");

  return NextResponse.redirect(url, 303);
}
