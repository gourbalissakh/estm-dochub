import { NextRequest, NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  const status = request.nextUrl.searchParams.get("status") as UserStatus | null;
  const q = request.nextUrl.searchParams.get("q") || undefined;
  const [students, counts] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(status ? { status } : {}),
        ...(q ? { OR: [{ firstName: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { filiere: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.groupBy({ by: ["status"], where: { role: "STUDENT" }, _count: true }),
  ]);
  return NextResponse.json({ students, counts });
}
