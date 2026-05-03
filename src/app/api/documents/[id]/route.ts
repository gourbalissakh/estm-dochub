import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const document = await prisma.document.findUnique({ where: { id: params.id }, include: { filiere: true } });
  if (!document || !document.isVisible) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  return NextResponse.json({ document });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  const body = await request.json();
  const document = await prisma.document.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      isVisible: typeof body.isVisible === "boolean" ? body.isVisible : undefined,
    },
  });
  return NextResponse.json({ document });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  await prisma.document.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
