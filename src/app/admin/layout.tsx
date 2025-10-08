import { getServerSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
