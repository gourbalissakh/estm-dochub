import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  const body = await request.json();
  const message = await prisma.message.update({
    where: { id: params.id },
    data: { isVisible: Boolean(body.isVisible) },
  });
  return NextResponse.json({ message });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acces admin requis." }, { status: 403 });
  await prisma.message.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
