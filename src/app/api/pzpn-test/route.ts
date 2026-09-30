import { NextResponse } from "next/server";
import { testPzpnConnection } from "@/lib/laczynaspilka";

export async function GET() {
  try {
    const result = await testPzpnConnection();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Nieznany błąd",
      },
      { status: 500 }
    );
  }
}
