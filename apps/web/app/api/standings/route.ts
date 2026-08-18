import { NextRequest, NextResponse } from "next/server";
import { fetchStandings } from "@/lib/brasileirao-convex";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const serie = request.nextUrl.searchParams.get("serie") ?? "a";
  const groupParam = request.nextUrl.searchParams.get("group");
  const group =
    groupParam && groupParam.trim() !== "" ? groupParam : undefined;

  try {
    const data = await fetchStandings(serie, group);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
