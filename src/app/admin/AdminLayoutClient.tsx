'use client';

import { SessionProvider } from "next-auth/react";
import Sidebar from "../components/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  session: any; // session obrigatória, passada pelo server layout
}

export default function AdminLayout({ children, session }: AdminLayoutProps) {
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
