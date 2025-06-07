'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.usuario === 'CAadmin' && loginData.senha === 'crisimobiliaria') {
      onClose();
      router.push('/admin');
    } else {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-900">Login Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="usuario">
              Usuário
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={loginData.usuario}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="senha">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={loginData.senha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-800"
              required
            />
          </div>
          {erro && <p className="text-red-600">{erro}</p>}
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 w-full transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
