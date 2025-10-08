import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
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
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = session.user as typeof session.user & { id: string; role?: string };
        user.id = token.sub!;
        user.role = (token as any).role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
