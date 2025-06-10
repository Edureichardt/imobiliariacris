'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Imovel = {
  id: string;
  tipo: string;
  endereco: string;
  preco: number;
  fotos: string[];   // array de URLs direto
  ativo: boolean;
};

export default function GerenciarImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    async function fetchImoveis() {
      console.log('Buscando imóveis no useEffect...');
      const res = await fetch('/api/imoveis?admin=true');
      const data = await res.json();
      console.log('Imóveis carregados:', data);
      setImoveis(data);
    }

    fetchImoveis();
  }, []);

  const toggleAtivo = async (id: string) => {
    console.log('toggleAtivo chamado para id:', id);
    setLoadingId(id);
    const res = await fetch(`/api/imoveis/${id}/ativar-desativar`, {
      method: 'PATCH',
    });

    if (res.ok) {
      const atualizado = await res.json();
      console.log('Resposta do servidor ao ativar/desativar:', atualizado);
      setImoveis(prev =>
        prev.map(imovel =>
          imovel.id === id ? { ...imovel, ativo: atualizado.ativo } : imovel
        )
      );
    } else {
      console.error('Erro ao atualizar o imóvel. Status:', res.status);
      alert('Erro ao atualizar o imóvel.');
    }

    setLoadingId(null);
  };

  const imoveisFiltrados = imoveis.filter(imovel => {
    const buscaTexto = busca.toLowerCase();
    const tipoFiltrado = filtroTipo
      ? imovel.tipo.toLowerCase() === filtroTipo.toLowerCase()
      : true;
    const enderecoOuTipo =
      imovel.endereco.toLowerCase().includes(buscaTexto) ||
      imovel.tipo.toLowerCase().includes(buscaTexto);

    return tipoFiltrado && enderecoOuTipo;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Imóveis</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por endereço ou tipo"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todos os tipos</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {imoveisFiltrados.map(imovel => (
          <div key={imovel.id} className="border rounded shadow p-4">
            <Image
              src={imovel.fotos?.[0] || 'https://picsum.photos/400/300'}
              alt={imovel.tipo}
              width={400}
              height={300}
              className="rounded mb-2 object-cover w-full h-48"
            />
            <h2 className="font-semibold capitalize">{imovel.tipo}</h2>
            <p className="text-sm text-gray-700">{imovel.endereco}</p>
            <p className="text-green-800 font-bold mb-2">
              R$ {imovel.preco.toLocaleString('pt-BR')}
            </p>
            <button
              onClick={() => toggleAtivo(imovel.id)}
              disabled={loadingId === imovel.id}
              className={`w-full py-2 px-4 rounded transition-colors duration-200 ${
                imovel.ativo
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loadingId === imovel.id
                ? 'Aguarde...'
                : imovel.ativo
                ? 'Desativar'
                : 'Ativar'}
            </button>
          </div>
        ))}
        {imoveisFiltrados.length === 0 && (
          <p className="text-center col-span-full text-gray-500">Nenhum imóvel encontrado.</p>
        )}
      </div>
    </div>
  );
}
