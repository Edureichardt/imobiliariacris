import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-bl from-green-900 to-black text-white p-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo e Título */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link href="/">
            <Image
              src="/logo1.png"
              alt="Logotipo da CA Imóveis"
              width={80}
              height={50}
              priority
            />
          </Link>
          <h1 className="text-3xl font-serif">CA Imóveis</h1>
        </div>

        {/* Navegação */}
        <nav className="space-x-6 text-lg font-serif">
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
