import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing creds" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "7d" }
  );

  return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}