import { redirect } from "next/navigation";
import AdminLayoutClient from './AdminLayoutClient';
import { getServerSession } from "@/lib/auth"; // usa a função da lib

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  // Redireciona se não estiver logado ou não for admin
  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  // Renderiza o layout client passando a session
  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
