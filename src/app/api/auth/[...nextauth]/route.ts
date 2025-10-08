import 'dotenv/config'; // garante que o .env.local seja carregado
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ADMIN_USER, ADMIN_HASH } from "../../../config/admin-config.mjs";

/**
 * Endpoint de autenticação para NextAuth usando credenciais de administrador.
 * - Valida usuário e senha via bcrypt.
 * - Garante tipos corretos para TypeScript.
 */

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        usuario: { label: "Usuário", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Verifica se credenciais foram fornecidas
        if (!credentials?.usuario || !credentials?.senha) {
          console.warn("⚠️ Usuário ou senha não fornecidos");
          return null;
        }

        // Garante que hash sempre seja string
        const hash: string = ADMIN_HASH ?? process.env.ADMIN_PW_HASH ?? "";
        if (!hash) {
          console.error("❌ ADMIN_HASH ou ADMIN_PW_HASH não definido");
          return null;
        }

        // Valida a senha
        const senhaValida = await bcrypt.compare(credentials.senha, hash);

        if (credentials.usuario === ADMIN_USER && senhaValida) {
          console.log("✅ Login autorizado para administrador");
          return { id: "1", name: "Administrador" };
        }

        console.warn("❌ Login falhou: usuário ou senha incorretos");
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
