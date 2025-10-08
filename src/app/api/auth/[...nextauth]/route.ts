import 'dotenv/config'; // garante que o .env.local seja carregado
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ADMIN_USER, ADMIN_HASH } from "../../../config/admin-config.mjs";

// ajuste o caminho conforme necessário

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        usuario: { label: "Usuário", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credenciais recebidas:", credentials);
        console.log("ADMIN_USER:", ADMIN_USER);
        console.log("ADMIN_HASH:", ADMIN_HASH);

        if (!credentials?.usuario || !credentials?.senha) {
          console.log("⚠️ Faltando usuário ou senha");
          return null;
        }

        // Cria uma variável de hash tipada como string
        const hash: string = ADMIN_HASH || process.env.ADMIN_PW_HASH!;
        if (!hash) throw new Error("ADMIN_PW_HASH não definido");

        // Usa a variável 'hash' no compare
        const senhaValida = await bcrypt.compare(credentials.senha, hash);
        console.log("Senha válida?", senhaValida);

        if (credentials.usuario === ADMIN_USER && senhaValida) {
          console.log("✅ Login autorizado!");
          return { id: "1", name: "Administrador" };
        }

        console.log("❌ Login falhou");
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
