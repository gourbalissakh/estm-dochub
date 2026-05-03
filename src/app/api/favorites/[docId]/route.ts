import { NextRequest, NextResponse } from "next/server";
import { requireValidatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: { docId: string } }) {
  const session = await requireValidatedUser();
  if (!session) return NextResponse.json({ error: "Compte valide requis." }, { status: 401 });
  await prisma.favorite.upsert({
    where: { userId_documentId: { userId: session.user.id, documentId: params.docId } },
    update: {},
    create: { userId: session.user.id, documentId: params.docId },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { docId: string } }) {
  const session = await requireValidatedUser();
  if (!session) return NextResponse.json({ error: "Compte valide requis." }, { status: 401 });
  await prisma.favorite.delete({ where: { userId_documentId: { userId: session.user.id, documentId: params.docId } } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
