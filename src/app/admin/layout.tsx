import { redirect } from "next/navigation";
import { getServerSession } from "@/app/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pega a sessão no servidor
  const session = await getServerSession();

  // Bloqueia se não estiver logado ou não for admin
  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin"); // redireciona para a página de login
  }

  // Renderiza o layout client passando a session
  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
