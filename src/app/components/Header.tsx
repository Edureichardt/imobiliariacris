import Image from 'next/image';
export default function Header() {
  return (
    <header className="bg-gradient-to-bl from-green-900 to-black text-white p-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image src="/logo1.png" alt="Logo" width={80} height={50} />
          <h1 className="text-3xl font-serif ">CA Imóveis</h1>
        </div>
        <nav className="space-x-6">
          <a href="/" className="hover:underline font-serif ">Início</a>
          <a href="/#imoveis" className="hover:underline font-serif ">Imóveis</a>
          <a href="/contato" className="hover:underline font-serif ">Contato</a>
          <a
            href="https://wa.me/554791648594"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-serif "
          >
            Anuncie seu imóvel
          </a>
        </nav>
      </div>
    </header>
  )
}