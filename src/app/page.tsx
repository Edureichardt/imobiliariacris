'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Loading from './components/Loading';
import BannerRotativo from './components/BannerRotativo';
import InstagramSection from './components/InstagramSection';

type Filtros = {
  tipo: string;
  cidade: string;
  bairro: string;
  operacao: string;
};

type Imovel = {
  id: string | number;
  tipo: string;
  endereco: string;
  preco: number | string;
  fotos?: string[];
  capa?: string; // agora incluímos capa
  cidade?: string;
  bairro?: string;
  operacao?: string;
  ativo?: boolean;
};

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

const Pesquisa: React.FC<{
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  onSearch: () => void;
}> = ({ filtros, setFiltros, onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md mb-10 relative z-10 -mt-12 md:-mt-20">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end"
      >
        {[{ label: 'Tipo', name: 'tipo', options: ['', 'casa', 'apartamento', 'terreno', 'comercial', 'sítio'] },
          { label: 'Cidade', name: 'cidade', options: ['', 'Rio Negro - PR', 'Mafra - SC', 'Itaiópolis - SC', 'Monte Castelo - PR','Litoral','Papanduva - SC','Canoinhas - SC' ] },
          { label: 'Operação', name: 'operacao', options: ['', 'comprar', 'alugar'] }].map(({ label, name, options }) => (
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
          <Button type="submit">Buscar</Button>
        </div>
      </form>
    </section>
  );
};

const ITEMS_PER_PAGE = 4;

// função atualizada para considerar capa
const getFotoUrl = (imovel: Imovel) => {
  if (imovel.capa) return imovel.capa;
  if (Array.isArray(imovel.fotos) && imovel.fotos.length > 0) return imovel.fotos[0];
  return 'https://picsum.photos/600/400';
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
            currentPage === i + 1 ? 'bg-green-900 text-white' : 'bg-gray-200 hover:bg-gray-300'
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

const NavegacaoImoveis: React.FC<{
  titulo: string;
  imoveis: Imovel[];
}> = ({ titulo, imoveis }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const dadosPagina = imoveis.slice((paginaAtual - 1) * ITEMS_PER_PAGE, paginaAtual * ITEMS_PER_PAGE);

  return (
    <section className="max-w-7xl mx-auto mb-12" id="imoveis">
      <h2 className="text-3xl font-semibold mb-6">{titulo}</h2>
      {dadosPagina.length === 0 ? (
        <p className="text-center">Nenhum imóvel encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {dadosPagina.map((imovel) => (
              <div
                key={imovel.id}
                className="border rounded-lg overflow-hidden shadow-md hover:scale-[1.02] transition"
              >
                <Link href={`/imovel/${imovel.id}`}>
                  <Image
                    src={getFotoUrl(imovel)}
                    alt={`Imagem do imóvel ${imovel.tipo} em ${imovel.bairro}`}
                    width={500}
                    height={300}
                    className="min-w-full h-60 object-cover bg-center cursor-pointer"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 capitalize">{imovel.tipo}</h3>
                  <p className="text-gray-600 mb-1">{imovel.endereco}</p>
                  <p className="text-green-700 font-bold">
                    R$ {Number(imovel.preco).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Paginacao
            totalItems={imoveis.length}
            currentPage={paginaAtual}
            onPageChange={setPaginaAtual}
          />
        </>
      )}
    </section>
  );
};

const Destaques: React.FC = () => {
  const [destaques, setDestaques] = useState<Imovel[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        const res = await fetch(`/api/imoveis/destaque?ts=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        setDestaques(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar destaques:', err);
        setDestaques([]);
      }
    };
    fetchDestaques();
  }, []);

  const dadosPagina = destaques.slice((paginaAtual - 1) * ITEMS_PER_PAGE, paginaAtual * ITEMS_PER_PAGE);

  return (
    <section className="bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Imóveis em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {dadosPagina.map((imovel) => (
          <div
            key={imovel.id}
            className="border rounded shadow p-4 bg-white hover:scale-[1.02] transition"
          >
            <Link href={`/imovel/${imovel.id}`}>
              <img
                src={getFotoUrl(imovel)}
                alt={`Foto do imóvel em ${imovel.bairro ?? 'localização'}`}
                className="h-60 w-full object-cover mb-2 rounded cursor-pointer"
              />
            </Link>
            <h3 className="text-xl font-semibold capitalize">{imovel.tipo} - {imovel.bairro}</h3>
            <p className="text-gray-600">{imovel.cidade}</p>
            <p className="text-green-700 font-bold">
              R$ {Number(imovel.preco).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm">
              {imovel.operacao === 'comprar' ? 'À venda' : 'Para alugar'}
            </p>
          </div>
        ))}
      </div>
      <Paginacao
        totalItems={destaques.length}
        currentPage={paginaAtual}
        onPageChange={setPaginaAtual}
      />
    </section>
  );
};

const HomePage: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: '',
    cidade: '',
    bairro: '',
    operacao: '',
  });

  const buscarImoveis = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/imoveis';
      const queryParams: string[] = [];

      if (filtros.tipo) queryParams.push(`tipo=${encodeURIComponent(filtros.tipo)}`);
      if (filtros.cidade) queryParams.push(`cidade=${encodeURIComponent(filtros.cidade)}`);
      if (filtros.bairro) queryParams.push(`bairro=${encodeURIComponent(filtros.bairro)}`);
      if (filtros.operacao) queryParams.push(`operacao=${encodeURIComponent(filtros.operacao)}`);

      if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

      const res = await fetch(url);
      const data = await res.json();
      setImoveis(Array.isArray(data) ? data : []);
    } catch {
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    buscarImoveis();
  }, [buscarImoveis]);

  const imoveisVenda = imoveis.filter((i) => i.operacao === 'comprar' && i.ativo !== false);
  const imoveisAluguel = imoveis.filter((i) => i.operacao === 'alugar' && i.ativo !== false);

  return (
    <>
      <BannerRotativo />
      <Pesquisa filtros={filtros} setFiltros={setFiltros} onSearch={buscarImoveis} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <Destaques />
          <NavegacaoImoveis titulo="Imóveis à Venda" imoveis={imoveisVenda} />
          <NavegacaoImoveis titulo="Imóveis para Alugar" imoveis={imoveisAluguel} />
          <InstagramSection />
        </>
      )}
    </>
  );
};

export default HomePage;
