import { NextResponse } from "next/server";
import { adminCookieName, createAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password");

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      {
        error: "Brak ADMIN_PASSWORD na serwerze.",
      },
      {
        status: 500,
      }
    );
  }

  if (password !== adminPassword) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "1");

    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);

  response.cookies.set({
    name: adminCookieName,
    value: createAdminSessionValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
