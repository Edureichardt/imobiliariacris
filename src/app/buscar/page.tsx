'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type Filtros = {
  tipo: string;
  cidade: string;
  bairro: string;
  operacao: string;
  endereco: string;
  valorMin: string;
  valorMax: string;
};

type Imovel = {
  id: string | number;
  tipo: string;
  endereco: string;
  preco: number | string;
  fotos?: { url: string }[];
  cidade?: string;
  bairro?: string;
  operacao?: string;
  ativo?: boolean;
};

const ITEMS_PER_PAGE = 6;

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    className={`bg-green-950 hover:bg-green-800 text-white px-6 py-3 rounded-full w-full transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const formatarValorInput = (valor: string) => {
  return valor.replace(/\D/g, '');
};

const Pesquisa: React.FC<{
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  onSearch: () => void;
  className?: string;
}> = ({ filtros, setFiltros, onSearch, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'valorMin' || name === 'valorMax') {
      const val = formatarValorInput(value);
      setFiltros((prev) => ({ ...prev, [name]: val }));
    } else {
      setFiltros((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className={`p-4 bg-white rounded shadow max-w-xs ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          {
            label: 'Tipo',
            name: 'tipo',
            options: ['', 'casa', 'apartamento', 'terreno', 'comercial', 'sítio'],
          },
          { label: 'Cidade', name: 'cidade', options: ['', 'Rio Negro - PR', 'Mafra - SC'] },
          { label: 'Operação', name: 'operacao', options: ['', 'comprar', 'alugar'] },
        ].map(({ label, name, options }) => (
          <div key={name}>
            <label className="block mb-1 font-semibold">{label}</label>
            <select
              name={name}
              value={(filtros as any)[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'Todos'}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block mb-1 font-semibold">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={filtros.bairro}
            onChange={handleChange}
            placeholder="Digite o bairro"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={filtros.endereco}
            onChange={handleChange}
            placeholder="Digite o endereço"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Valor Min</label>
            <input
              type="text"
              name="valorMin"
              value={filtros.valorMin}
              onChange={handleChange}
              placeholder="R$ 0"
              className="w-full border border-gray-300 rounded p-2"
              inputMode="numeric"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Valor Max</label>
            <input
              type="text"
              name="valorMax"
              value={filtros.valorMax}
              onChange={handleChange}
              placeholder="R$ 0"
              className="w-full border border-gray-300 rounded p-2"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <Button type="submit">Buscar</Button>
        </div>
      </form>
    </section>
  );
};

const Paginacao: React.FC<{
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-3">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? 'bg-green-900 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onPageChange(i + 1)}
          aria-label={`Página ${i + 1}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

const getFotoUrl = (fotos?: { url: string }[]) => {
  if (Array.isArray(fotos) && fotos.length > 0) {
    return fotos[0].url;
  }
  return 'https://picsum.photos/600/400';
};

const ListaImoveis: React.FC<{
  imoveis: Imovel[];
  paginaAtual: number;
  onPageChange: (page: number) => void;
}> = ({ imoveis, paginaAtual, onPageChange }) => {
  const dadosPagina = imoveis.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  return (
    <section className="flex-1 w-full max-w-5xl">
      {dadosPagina.length === 0 ? (
        <p className="text-center mt-8">Nenhum imóvel encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dadosPagina.map(({ id, tipo, endereco, preco, fotos, bairro }) => (
              <div
                key={id}
                className="border rounded-lg overflow-hidden shadow-md hover:scale-[1.02] transition"
              >
                <Link href={`/imovel/${id}`}>
                  <Image
                    src={getFotoUrl(fotos)}
                    alt={`Imagem do imóvel ${tipo} em ${bairro}`}
                    width={500}
                    height={300}
                    className="w-full h-60 object-cover bg-center cursor-pointer"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 capitalize">{tipo}</h3>
                  <p className="text-gray-600 mb-1">{endereco}</p>
                  <p className="text-green-700 font-bold">
                    R$ {Number(preco).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Paginacao
            totalItems={imoveis.length}
            currentPage={paginaAtual}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filtros, setFiltros] = useState<Filtros>({
    tipo: '',
    cidade: '',
    bairro: '',
    operacao: '',
    endereco: '',
    valorMin: '',
    valorMax: '',
  });

  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Sincroniza filtros com query params
  useEffect(() => {
    setFiltros({
      tipo: searchParams.get('tipo') ?? '',
      cidade: searchParams.get('cidade') ?? '',
      bairro: searchParams.get('bairro') ?? '',
      operacao: searchParams.get('operacao') ?? '',
      endereco: searchParams.get('endereco') ?? '',
      valorMin: searchParams.get('valorMin') ?? '',
      valorMax: searchParams.get('valorMax') ?? '',
    });
    setPaginaAtual(1);
  }, [searchParams]);

  const buscarImoveis = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/imoveis/buscar';
      const queryParams: string[] = [];

      if (filtros.tipo) queryParams.push(`tipo=${encodeURIComponent(filtros.tipo)}`);
      if (filtros.cidade) queryParams.push(`cidade=${encodeURIComponent(filtros.cidade)}`);
      if (filtros.bairro) queryParams.push(`bairro=${encodeURIComponent(filtros.bairro)}`);
      if (filtros.operacao) queryParams.push(`operacao=${encodeURIComponent(filtros.operacao)}`);
      if (filtros.endereco) queryParams.push(`endereco=${encodeURIComponent(filtros.endereco)}`);
      if (filtros.valorMin) queryParams.push(`valorMin=${encodeURIComponent(filtros.valorMin)}`);
      if (filtros.valorMax) queryParams.push(`valorMax=${encodeURIComponent(filtros.valorMax)}`);

      router.replace(`/buscar?${queryParams.join('&')}`, { scroll: false });
      setPaginaAtual(1);

      const res = await fetch(`${url}?${queryParams.join('&')}`);
      const data = await res.json();
      setImoveis(Array.isArray(data) ? data : []);
    } catch {
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, router]);

  useEffect(() => {
    buscarImoveis();
  }, [buscarImoveis]);

  return (
    <main
      className="max-w-7xl mx-auto px-4 py-8 pt-[72px] min-h-screen
      flex flex-col md:flex-row gap-8"
    >
      {/* Filtro sticky no desktop */}
      <Pesquisa
        filtros={filtros}
        setFiltros={setFiltros}
        onSearch={buscarImoveis}
        className="w-full max-w-xs md:max-w-none md:w-64 sticky top-[72px] hidden md:block"
      />

      {/* Filtro visível no topo em mobile */}
      <div className="block md:hidden mb-4">
        <Pesquisa filtros={filtros} setFiltros={setFiltros} onSearch={buscarImoveis} />
      </div>

      {/* Lista de imóveis */}
      <section className="flex-1 w-full">
        {loading ? (
          <p>Carregando imóveis...</p>
        ) : (
          <ListaImoveis
            imoveis={imoveis}
            paginaAtual={paginaAtual}
            onPageChange={setPaginaAtual}
          />
        )}
      </section>
    </main>
  );
}
