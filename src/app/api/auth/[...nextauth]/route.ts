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

        // Verifica se usuário e senha foram preenchidos
        if (!credentials?.usuario || !credentials?.senha) {
          console.log("⚠️ Faltando usuário ou senha");
          return null;
        }

        // Pega o hash do admin (do arquivo de config ou do .env)
        const hashFromConfig = ADMIN_HASH;
        const hashFromEnv = process.env.ADMIN_PW_HASH;
        const hash: string | null = hashFromConfig ?? hashFromEnv ?? null;

        if (!hash) {
          console.error("🚨 Nenhum hash de senha definido (ADMIN_HASH ou ADMIN_PW_HASH)");
          return null; // evita crash
        }

        // Valida a senha
        const senhaValida = await bcrypt.compare(credentials.senha, hash);
        console.log("Senha válida?", senhaValida);

        // Retorna o usuário se as credenciais estiverem corretas
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
