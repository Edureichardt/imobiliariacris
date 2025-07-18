'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-gradient-to-bl from-green-900 to-black text-white p-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo e Título */}
        <Link href="/" className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image
            src="/logo1.png"
            alt="CA Imóveis"
            width={80}
            height={50}
            priority
          />
          <h1 className="text-3xl font-serif">CA Imóveis</h1>
        </Link>

        {/* Navegação */}
        <nav className="flex items-center space-x-6 text-lg font-serif">
          <a
            href="https://www.instagram.com/imobiliariacaimoveis/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-400 transition"
          >
            <FaInstagram size={24} />
          </a>

          <Link href="/" className="hover:underline">
            Início
          </Link>
          <Link href="/#imoveis" className="hover:underline">
            Imóveis
          </Link>
          <Link href="/contato" className="hover:underline">
            Contato
          </Link>
          <a
            href="https://wa.me/554791648594"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Anuncie seu imóvel
          </a>
        </nav>
      </div>
    </header>
  );
}
