import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

function getUserId(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const [, token] = auth.split(" ");
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { sub: string };
    return payload.sub;
  } catch { return null; }
}

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.post.findMany({ where: { authorId: userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, content } = await req.json();
  if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const post = await prisma.post.create({ data: { title, content, authorId: userId } });
  return NextResponse.json(post, { status: 201 });
}