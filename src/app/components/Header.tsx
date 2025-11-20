'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaInstagram,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
  FaBars,
} from 'react-icons/fa';

const tipos = ['Casa', 'Apartamento', 'Terreno', 'Comercial', 'Sítio'];
const cidades = ['Rio Negro ', 'Mafra ', 'Itaiópolis ', 'Monte Castelo ','Litoral','Papanduva ','Canoinhas ','São Bento do Sul'];

function formatarValor(valor: string) {
  const numeros = valor.replace(/\D/g, '');
  if (!numeros) return '';
  const numero = parseInt(numeros, 10);
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [centralOpen, setCentralOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  const [tipo, setTipo] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [valor, setValor] = useState('');

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(!(currentScrollY > lastScrollY && currentScrollY > 100));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setMenuMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  function onBuscarClick() {
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (cidade) params.append('cidade', cidade);
    if (bairro.trim()) params.append('bairro', bairro.trim());
    if (valor) {
      const valorLimpo = valor.replace(/\./g, '').replace(/,/g, '.');
      params.append('valor', valorLimpo);
    }

    router.push(`/buscar?${params.toString()}`);
    setSidebarOpen(false);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-tl from-green-950 to-black text-white py-2 shadow-md transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center px-4 relative h-24 gap-4 sm:gap-6
">

          {/* LOGO */}
          <Link href="/" className="z-30 flex-shrink-0">
            <div className="bg-black bg-opacity-70 border border-green-400 rounded-lg p-4 flex flex-col items-center shadow-lg">
              <Image
                src="/logo1.png"
                alt="CA Imóveis"
                width={80}
                height={50}
                priority
                className="object-contain mt-1"
              />
              <span className="mt-2 text-white lowercase font-semibold text-base leading-none">
                ca imóveis
              </span>
              <span className="mt-1 text-green-300 text-xs font-light italic max-w-[140px] text-center">
                Excelência em Negócios Imobiliários
              </span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:underline">Início</Link>
            <Link href="/#imoveis" className="hover:underline">Imóveis</Link>
            <Link href="/contato" className="hover:underline">Contato</Link>
            <a
              href="https://wa.me/554791648594"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Anuncie seu imóvel
            </a>
          </nav>

          <div className="flex-1" />

          {/* Ícones sociais e busca */}
          <div className="flex items-center space-x-4 relative">

            <a
              href="https://www.instagram.com/imobiliariacaimoveis/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-lg hover:text-pink-400"
            >
              <FaInstagram />
            </a>

            <div
              className="relative cursor-pointer bg-black bg-opacity-70 border border-green-400 rounded-lg p-3 shadow-lg text-sm font-medium text-white select-none flex items-center space-x-2 hidden md:flex"
              onMouseEnter={() => setCentralOpen(true)}
              onMouseLeave={() => setCentralOpen(false)}
            >
              <FaPhone className="text-green-400" />
              <span className="whitespace-nowrap">Central de Atendimento</span>
              {centralOpen ? (
                <FaChevronUp className="text-green-400" />
              ) : (
                <FaChevronDown className="text-green-400" />
              )}

              <div
                className={`absolute left-0 top-full mt-1 w-56 bg-black bg-opacity-90 border border-green-400 rounded-md p-4 text-xs text-white transition-opacity duration-200 z-50 shadow-lg ${
                  centralOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="mb-2 flex items-center space-x-2">
                  <FaWhatsapp className="text-green-400" />
                  <strong>WhatsApp:</strong>
                  <a
                    href="https://wa.me/554791648594"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    (47) 99164-8594
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <FaEnvelope className="text-green-400" />
                  <strong>Email:</strong>
                  <a
                    href="mailto:contato@caimoveis.com.br"
                    className="text-green-400 hover:underline"
                  >
                    contato@caimoveis.com.br
                  </a>
                </p>
              </div>
            </div>

            {/* Botão busca - sempre visível */}
            <button
              type="button"
              aria-label="Abrir busca avançada"
              className="text-white hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
              onClick={() => setSidebarOpen(true)}
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Botão menu mobile */}
            <button
              type="button"
              aria-label="Abrir menu mobile"
              className="md:hidden text-white hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
              onClick={() => setMenuMobileOpen((v) => !v)}
            >
              <FaBars className="text-lg" />
            </button>
          </div>
        </div>

        {/* MENU MOBILE dropdown */}
        {menuMobileOpen && (
          <nav className="md:hidden bg-black bg-opacity-90 border-t border-green-400 p-4 space-y-3 text-white text-center z-50 absolute top-24 left-0 right-0 shadow-lg">
            <Link href="/" className="block hover:underline" onClick={() => setMenuMobileOpen(false)}>
              Início
            </Link>
            <Link href="/#imoveis" className="block hover:underline" onClick={() => setMenuMobileOpen(false)}>
              Imóveis
            </Link>
            <Link href="/contato" className="block hover:underline" onClick={() => setMenuMobileOpen(false)}>
              Contato
            </Link>
            <a
              href="https://wa.me/554791648594"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline"
              onClick={() => setMenuMobileOpen(false)}
            >
              Anuncie seu imóvel
            </a>
          </nav>
        )}
      </header>

      {/* Sidebar busca avançada */}
      <div
        className={`fixed top-0 right-0 h-full bg-black bg-opacity-95 text-white shadow-lg transform transition-transform duration-300 z-50
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full max-w-md md:w-80
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-green-400">
          <h2 className="text-lg font-semibold">Busca Avançada</h2>
          <button
            aria-label="Fechar busca"
            onClick={() => setSidebarOpen(false)}
            className="text-green-400 hover:text-green-600 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-72px)]">
          <div>
            <label className="block font-semibold mb-2">Tipo de Negócio</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setTipo('Venda')}
                className={`flex-1 py-2 rounded border ${
                  tipo === 'Venda' ? 'bg-green-600 border-green-600' : 'border-green-400'
                }`}
              >
                Venda
              </button>
              <button
                type="button"
                onClick={() => setTipo('Locação')}
                className={`flex-1 py-2 rounded border ${
                  tipo === 'Locação' ? 'bg-green-600 border-green-600' : 'border-green-400'
                }`}
              >
                Locação
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="tipoImovel" className="block font-semibold mb-2">
              Tipo de Imóvel
            </label>
            <select
              id="tipoImovel"
              value={tipo !== 'Venda' && tipo !== 'Locação' ? tipo : ''}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-black border border-green-400 rounded px-3 py-2 text-white"
            >
              <option value="">Selecione</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cidade" className="block font-semibold mb-2">Cidade</label>
            <select
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full bg-black border border-green-400 rounded px-3 py-2 text-white"
            >
              <option value="">Selecione</option>
              {cidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bairro" className="block font-semibold mb-2">Bairro</label>
            <input
              id="bairro"
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Digite o bairro"
              className="w-full bg-black border border-green-400 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label htmlFor="valor" className="block font-semibold mb-2">Valor (R$)</label>
            <input
              id="valor"
              type="text"
              value={valor}
              onChange={(e) => setValor(formatarValor(e.target.value))}
              placeholder="Ex: 1.000,00"
              className="w-full bg-black border border-green-400 rounded px-3 py-2 text-white"
            />
          </div>

          <button
            type="button"
            onClick={onBuscarClick}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
