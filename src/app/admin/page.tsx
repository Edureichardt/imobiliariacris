'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona se não estiver logado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-green-900">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-green-900 mb-4 text-center">
          Painel Administrativo
        </h1>

        <p className="text-gray-700 mb-6 text-center">
          Bem-vindo, <span className="font-semibold">{session?.user?.name || "Administrador"}</span> 👋
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/admin/novo-imovel")}
            className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-lg transition"
          >
            Gerenciar Imóveis
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
