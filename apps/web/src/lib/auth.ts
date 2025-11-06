import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    GitHubProvider({ clientId: process.env.GITHUB_ID ?? "", clientSecret: process.env.GITHUB_SECRET ?? "" }),
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return user;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = (user as any).id; token.role = (user as any).role ?? "USER"; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { (session.user as any).id = token.id; (session.user as any).role = token.role; }
      return session;
    }
  }
};