import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  const since = new Date();
  since.setDate(since.getDate() - 6);
  const [documents, students, downloads, messages] = await Promise.all([
    prisma.document.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.download.count(),
    prisma.message.count(),
  ]);
  const raw = await prisma.download.groupBy({ by: ["createdAt"], where: { createdAt: { gte: since } }, _count: true });
  const activity = Array.from({ length: 7 }).map((_, offset) => {
    const date = new Date(since);
    date.setDate(since.getDate() + offset);
    const key = date.toISOString().slice(0, 10);
    return { day: key.slice(5), downloads: raw.filter((item) => item.createdAt.toISOString().startsWith(key)).reduce((sum, item) => sum + item._count, 0) };
  });
  return NextResponse.json({ kpis: { documents, students, downloads, messages }, activity });
}
