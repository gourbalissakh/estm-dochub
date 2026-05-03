import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Connexion requise pour telecharger." }, { status: 401 });
  const document = await prisma.document.update({
    where: { id: params.id },
    data: { downloadCount: { increment: 1 }, downloads: { create: { userId: session.user.id } } },
  });
  const filePath = path.join(process.cwd(), document.filePath);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Fichier indisponible." }, { status: 404 });
  const stream = fs.createReadStream(filePath) as any;
  return new NextResponse(stream, {
    headers: {
      "content-type": document.fileType,
      "content-disposition": `attachment; filename="${path.basename(document.filePath)}"`,
    },
  });
}
