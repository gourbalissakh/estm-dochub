import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const filieres = await prisma.filiere.findMany({
    orderBy: [{ sector: "desc" }, { name: "asc" }],
    include: { _count: { select: { documents: true, users: true } } },
  });
  return NextResponse.json({ filieres });
}
