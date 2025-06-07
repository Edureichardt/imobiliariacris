'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { main } from 'framer-motion/client';





// Botão reutilizável
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

// Componente Logo
const Logo = () => (
  <Image
    src="/logo1.png"
    alt="Logo da CA Imóveis"
    width={90}
    height={90}
        className="relative translate-y-1.5"
    priority
  />
);

// Pesquisa com filtros
const Pesquisa = ({
  filtros,
  setFiltros,
  onSearch,
}: {
  filtros: { [key: string]: string };
  setFiltros: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  onSearch: () => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md mb-10 -mt-20 relative z-10">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end"
      >
        {[
          { label: 'Tipo', name: 'tipo', options: ['', 'casa', 'apartamento', 'terreno', 'comercial', 'sítio'] },
          { label: 'Cidade', name: 'cidade', options: ['', 'Rio Negro - PR', 'Mafra - SC'] },
          { label: 'Operação', name: 'operacao', options: ['', 'comprar', 'alugar'] },
        ].map(({ label, name, options }) => (
          <div key={name}>
            <label className="block mb-1 font-semibold">{label}</label>
            <select
              name={name}
              value={filtros[name]}
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

// Banner rotativo
const BannerRotativo = ({ children }: { children: React.ReactNode }) => {
  const imagens = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg'];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] mb-12">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {imagens.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image src={src} alt={`Banner ${i + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h2 className="text-white text-4xl md:text-5xl font-serif text-center px-4">
                  A melhor escolha no lugar certo é aqui
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-[-80px] w-full">{children}</div>
    </div>
  );
};

// Tipagem imóvel
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

const ITEMS_PER_PAGE = 4;

// Paginação
const Paginacao = ({
  totalItems,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
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
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

// Destaques
const Destaques = () => {
  const [destaques, setDestaques] = useState<Imovel[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const fetchDestaques = async () => {
      const res = await fetch('/api/imoveis/destaques');
      const data = await res.json();
      setDestaques(data);
      setPaginaAtual(1);
    };
    fetchDestaques();
  }, []);

  const startIndex = (paginaAtual - 1) * ITEMS_PER_PAGE;
  const dadosPagina = destaques.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Imóveis em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {dadosPagina.map(imovel => (
          <div
            key={imovel.id}
            className="border rounded shadow p-4 bg-white hover:scale-[1.02] transition"
          >
            <Link href={`/imovel/${imovel.id}`}>
              <img
                src={imovel.fotos?.[0]?.url || 'https://picsum.photos/600/400'}
                alt={`Foto do imóvel em ${imovel.bairro}`}
                className="h-60 w-full object-cover mb-2 rounded cursor-pointer"
              />
            </Link>
            <h3 className="text-xl font-semibold capitalize">
              {imovel.tipo} - {imovel.bairro}
            </h3>
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

// Navegação dos imóveis
const NavegacaoImoveis = ({
  titulo,
  imoveis,
}: {
  titulo: string;
  imoveis: Imovel[];
}) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const startIndex = (paginaAtual - 1) * ITEMS_PER_PAGE;
  const dadosPagina = imoveis.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="max-w-7xl mx-auto mb-12" id="imoveis">
      <h2 className="text-3xl font-semibold mb-6">{titulo}</h2>
      {imoveis.length === 0 ? (
        <p>Nenhum imóvel encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {dadosPagina.map(({ id, tipo, endereco, preco, fotos, bairro }) => (
              <div
                key={id}
                className="border rounded-lg overflow-hidden shadow-md hover:scale-[1.02] transition"
              >
                <Link href={`/imovel/${id}`}>
                  <Image
                    src={fotos?.[0]?.url || 'https://picsum.photos/600/400'}
                    alt={`Imagem do imóvel ${tipo} em ${bairro}`}
                    width={500}
                    height={300}
                    className="w-full h-60 object-cover cursor-pointer"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 capitalize">{tipo}</h3>
                  <p className="text-green-900 mb-1">{endereco}</p>
                  <p className="font-semibold">
                    R$ {Number(preco).toLocaleString('pt-BR')}
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



// Página principal
export default function Page() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filtros, setFiltros] = useState({
    tipo: '',
    cidade: '',
    bairro: '',
    operacao: '',
  });
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        const res = await fetch('/api/imoveis');
        const data = await res.json();
        if (res.ok) {
          const ativos = data.filter((i: Imovel) => i.ativo);
          setImoveis(ativos);
          setImoveisFiltrados(ativos);
        } else {
          throw new Error();
        }
      } catch {
        setImoveis([]);
        setImoveisFiltrados([]);
      }
    }
    fetchImoveis();
  }, []);

  const aplicarFiltros = useCallback(() => {
    let resultado = [...imoveis];
    if (filtros.tipo) resultado = resultado.filter(i => i.tipo === filtros.tipo);
    if (filtros.cidade) resultado = resultado.filter(i => i.cidade === filtros.cidade);
    if (filtros.bairro)
      resultado = resultado.filter(i =>
        i.bairro?.toLowerCase().includes(filtros.bairro.toLowerCase())
      );
    if (filtros.operacao) resultado = resultado.filter(i => i.operacao === filtros.operacao);
    setImoveisFiltrados(resultado);
  }, [filtros, imoveis]);

  const imoveisCompra = imoveisFiltrados.filter(i => i.operacao === 'comprar');
  const imoveisAluguel = imoveisFiltrados.filter(i => i.operacao === 'alugar');

return (
  <main>

    <BannerRotativo>
      <Pesquisa filtros={filtros} setFiltros={setFiltros} onSearch={aplicarFiltros} />
    </BannerRotativo>

    <Destaques />

    <NavegacaoImoveis titulo="Imóveis para Compra" imoveis={imoveisCompra} />
    <NavegacaoImoveis titulo="Imóveis para Aluguel" imoveis={imoveisAluguel} />

    
  </main>
  
);
