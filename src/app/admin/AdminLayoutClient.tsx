'use client';

import { SessionProvider } from "next-auth/react";
import Sidebar from "../components/Sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: any; // session passada do layout server-side
}

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  // Bloqueia renderização se session não existir ou usuário não for admin
  if (!session || session.user?.role !== "admin") {
    return null; // ou você pode colocar um <Loading /> ou mensagem
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
