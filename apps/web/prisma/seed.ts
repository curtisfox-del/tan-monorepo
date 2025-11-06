// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  console.log("🌱 Seeding database...");
  const hash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", name: "Admin", passwordHash: hash, role: "ADMIN" }
  });
  await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: { email: "user1@example.com", name: "Jane", passwordHash: hash, role: "USER" }
  });
  await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: { email: "user2@example.com", name: "John", passwordHash: hash, role: "USER" }
  });
  await prisma.post.createMany({
    data: [
      { title: "Welcome to TAN", content: "Your starter app is live.", authorId: admin.id },
      { title: "Second Post", content: "Build fast with Next.js + Prisma.", authorId: admin.id }
    ]
  });
  console.log("✅ Seeding complete!");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });