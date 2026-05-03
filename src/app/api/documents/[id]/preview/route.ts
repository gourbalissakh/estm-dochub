import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function previewDocument(params: { id: string }) {
  const document = await prisma.document.findUnique({ where: { id: params.id } });
  if (!document || !document.isVisible) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  if (document.fileType !== "application/pdf") return NextResponse.json({ error: "Apercu PDF indisponible." }, { status: 415 });
  const filePath = path.join(process.cwd(), document.filePath);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Fichier indisponible." }, { status: 404 });
  const stream = fs.createReadStream(filePath) as any;
  return new NextResponse(stream, { headers: { "content-type": "application/pdf" } });
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  return previewDocument(params);
}

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  return previewDocument(params);
}
