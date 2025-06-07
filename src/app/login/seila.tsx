'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Usuário e senha fixos (exemplo)
    if (usuario === 'admin' && senha === '1234') {
      // Redireciona pra área admin
      router.push('/admin');
    } else {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Login Admin</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {erro && <p className="text-red-600">{erro}</p>}
        <button
          type="submit"
          className="w-full bg-green-900 text-white p-2 rounded hover:bg-green-800"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
