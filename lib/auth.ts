import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { createHash } from 'node:crypto';
import { db } from './db';
import { verifyPassword } from './password';
const windowMs = 15 * 60 * 1000;
export async function consumeAttempt(key: string, limit = 5) {
  const now = new Date();
  return db.$transaction(async (tx) => {
    const old = await tx.loginAttempt.findUnique({ where: { key } });
    if (!old || now.getTime() - old.windowStart.getTime() > windowMs) {
      await tx.loginAttempt.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      return true;
    }
    const row = await tx.loginAttempt.update({ where: { key }, data: { count: { increment: 1 } } });
    return row.count <= limit;
  });
}
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/prisijungti' },
  providers: [
    Credentials({
      name: 'Prisijungimas',
      credentials: {
        email: { label: 'El. paštas', type: 'email' },
        password: { label: 'Slaptažodis', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase(),
          password = credentials?.password;
        if (!email || !password || email.length > 254 || password.length > 256) return null;
        const key = createHash('sha256').update(email).digest('hex');
        if (!(await consumeAttempt('global', 150)) || !(await consumeAttempt(key))) return null;
        const user = await db.user.findUnique({ where: { email } });
        // Fixed expensive dummy hash avoids a cheap missing-user path.
        const ok = await verifyPassword(
          password,
          user?.passwordHash ||
            '00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        );
        if (!user || !ok) return null;
        return { id: user.id, email: user.email, role: user.role, version: user.sessionVersion };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.version = user.version;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = String(token.role);
        session.user.version = Number(token.version);
      }
      return session;
    },
  },
};
export async function currentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const u = await db.user.findUnique({ where: { id: session.user.id } });
  if (!u || u.sessionVersion !== session.user.version) return null;
  return u;
}
export async function requireUser(adminOnly = false) {
  const u = await currentUser();
  if (!u) redirect('/admin/prisijungti');
  if (adminOnly && u.role !== 'ADMIN')
    throw new Error('Šiam veiksmui reikia administratoriaus teisių.');
  return u;
}
