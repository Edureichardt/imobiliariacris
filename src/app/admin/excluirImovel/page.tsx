'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Imovel = {
  id: string;
  tipo: string;
  cidade: string;
  endereco: string;
  preco: number;
  fotos: string[];
  ativo: boolean;
};

export default function ExcluirImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Estados do filtro
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [ativoFiltro, setAtivoFiltro] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  useEffect(() => {
    async function fetchImoveis() {
      const res = await fetch('/api/imoveis?admin=true');
      if (res.ok) {
        const data = await res.json();
        setImoveis(data);
      } else {
        alert('Erro ao buscar imóveis.');
      }
    }
    fetchImoveis();
  }, []);

  const excluirImovel = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel? Essa ação não pode ser desfeita.')) {
      return;
    }

    setLoadingId(id);

    const res = await fetch(`/api/imoveis/${id}/excluirImovel`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setImoveis(prev => prev.filter(imovel => imovel.id !== id));
    } else {
      alert('Erro ao excluir imóvel.');
    }

    setLoadingId(null);
  };

  // Aplicar filtros
  const imoveisFiltrados = imoveis.filter(imovel => {
    if (tipoFiltro && imovel.tipo.toLowerCase() !== tipoFiltro.toLowerCase()) return false;
    if (cidadeFiltro && !imovel.cidade.toLowerCase().includes(cidadeFiltro.toLowerCase())) return false;
    if (ativoFiltro === 'ativos' && !imovel.ativo) return false;
    if (ativoFiltro === 'inativos' && imovel.ativo) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Excluir Imóveis</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todos os tipos</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por cidade"
          value={cidadeFiltro}
          onChange={(e) => setCidadeFiltro(e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={ativoFiltro}
          onChange={(e) => setAtivoFiltro(e.target.value as 'todos' | 'ativos' | 'inativos')}
          className="border rounded p-2"
        >
          <option value="todos">Todos</option>
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </select>

        <button
          onClick={() => {
            setTipoFiltro('');
            setCidadeFiltro('');
            setAtivoFiltro('todos');
          }}
          className="bg-gray-300 px-4 rounded hover:bg-gray-400 transition"
        >
          Limpar filtros
        </button>
      </div>

      {/* Lista filtrada */}
      {imoveisFiltrados.length === 0 ? (
        <p>Nenhum imóvel encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {imoveisFiltrados.map(imovel => (
            <div key={imovel.id} className="border rounded shadow p-4">
              <Image
                  src={imovel.fotos?.[0]}
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
                onClick={() => excluirImovel(imovel.id)}
                disabled={loadingId === imovel.id}
                className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
              >
                {loadingId === imovel.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
