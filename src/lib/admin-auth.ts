import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "gornik-admin-session";

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Brak ADMIN_SESSION_SECRET");
  }

  return secret;
}

function createSignature(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("hex");
}

export function createAdminSessionValue() {
  const value = "admin";
  const signature = createSignature(value);

  return `${value}.${signature}`;
}

export function verifyAdminSessionValue(session: string | undefined) {
  if (!session) {
    return false;
  }

  const [value, signature] = session.split(".");

  if (!value || !signature || value !== "admin") {
    return false;
  }

  const expectedSignature = createSignature(value);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  return verifyAdminSessionValue(session);
}

export const adminCookieName = COOKIE_NAME;