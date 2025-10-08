import { getServerSession as getNextAuthSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Função para usar no layout server-side
export async function getServerSession() {
  return await getNextAuthSession(authOptions);
}
