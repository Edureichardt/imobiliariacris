'use client';
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false, // usamos false para checar manualmente
      usuario,
      senha,
    });

    if (res?.error) {
      setErro("Usuário ou senha inválidos");
    } else {
      router.push("/admin"); // redireciona manualmente
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-green-900 mb-4">Login Admin</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {erro && <p className="text-red-600">{erro}</p>}
        <button
          type="submit"
          className="bg-green-900 text-white p-2 rounded hover:bg-green-800"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

