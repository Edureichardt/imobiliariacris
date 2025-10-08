import 'dotenv/config';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ADMIN_USER, ADMIN_HASH } from "../../../config/admin-config.mjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        usuario: { label: "Usuário", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.senha) {
          return null;
        }

        // Garantindo que hash seja uma string
        const hash: string = ADMIN_HASH ?? process.env.ADMIN_PW_HASH ?? "";
        if (!hash) {
          console.error("🚨 ADMIN_HASH ou ADMIN_PW_HASH não definidos");
          return null;
        }

        // bcrypt.compare agora recebe somente string
        const senhaValida = await bcrypt.compare(credentials.senha, hash);

        if (credentials.usuario === ADMIN_USER && senhaValida) {
          return { id: "1", name: "Administrador" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
