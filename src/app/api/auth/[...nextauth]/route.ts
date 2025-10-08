import NextAuth from "next-auth";
import { NextAuthOptions, User, Session } from "@auth/core/types"; // Importar de @auth/core/types
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuário", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validar credenciais
        if (!credentials?.usuario || !credentials?.senha) {
          throw new Error("Usuário e senha são obrigatórios");
        }

        const ADMIN_USER = process.env.ADMIN_USER;
        const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH;

        // Validar variáveis de ambiente
        if (!ADMIN_USER || !ADMIN_PW_HASH) {
          console.error("Erro: Variáveis de ambiente ausentes", {
            ADMIN_USER: !!ADMIN_USER,
            ADMIN_PW_HASH: !!ADMIN_PW_HASH,
          });
          throw new Error("Erro de configuração do servidor");
        }

        // Verificar usuário
        if (credentials.usuario !== ADMIN_USER) {
          throw new Error("Credenciais inválidas");
        }

        // Comparar senha
        const match = await bcrypt.compare(credentials.senha, ADMIN_PW_HASH);
        if (!match) {
          throw new Error("Credenciais inválidas");
        }

        // Retornar objeto de usuário
        return {
          id: "1",
          name: credentials.usuario,
          email: `${credentials.usuario}@admin.com`,
          role: "admin", // Propriedade role incluída
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Página de login customizada
    error: "/auth/error", // Página de erro customizada
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Exportar apenas o handler do NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };