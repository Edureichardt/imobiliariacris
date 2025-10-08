import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

// Exporta authOptions para usar no server layout
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuário", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.senha) {
          throw new Error("Usuário e senha são obrigatórios");
        }

        const ADMIN_USER = process.env.ADMIN_USER;
        const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH;

        if (!ADMIN_USER || !ADMIN_PW_HASH) {
          throw new Error("Erro de configuração do servidor");
        }

        if (credentials.usuario !== ADMIN_USER) {
          throw new Error("Credenciais inválidas");
        }

        const match = await bcrypt.compare(credentials.senha, ADMIN_PW_HASH);
        if (!match) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: "1",
          name: credentials.usuario,
          email: `${credentials.usuario}@admin.com`,
          role: "admin",
        } as User & { role: string };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT & { role?: string }; user?: User & { role?: string } }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: any; token: JWT & { role?: string } }) {
      if (token && session.user) session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
