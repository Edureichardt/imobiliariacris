// src/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string; // Adiciona a propriedade role ao tipo User
  }

  interface Session {
    user: {
      id: string;
      role: string; // Adiciona a propriedade role ao user na Session
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // Adiciona a propriedade role ao JWT
  }
}