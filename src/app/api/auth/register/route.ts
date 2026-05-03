import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "auth");
  if (limited) return limited;
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Cet email est deja utilise." }, { status: 409 });
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: await bcrypt.hash(data.password, 12),
      firstName: data.firstName,
      lastName: data.lastName,
      studentNumber: data.studentNumber || null,
      filiereId: data.filiereId,
      niveau: data.niveau,
      anneeAcademique: data.anneeAcademique,
      avatarUrl: data.avatarUrl || null,
    },
    select: { id: true, email: true, status: true },
  });
  return NextResponse.json({ user }, { status: 201 });
}
