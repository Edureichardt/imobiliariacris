import Image from 'next/image';
import { motion } from 'framer-motion';
// Adicione manualmente
const Button = ({ children, className }) => (
  <button className={className}>{children}</button>
);

const Card = ({ children, className }) => (
  <div className={`p-4 border rounded-lg ${className}`}>{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-green-900">
      <header className="bg-green-900 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ca Imóveis</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Início</a>
            <a href="#imoveis" className="hover:underline">Imóveis</a>
            <a href="#sobre" className="hover:underline">Sobre</a>
            <a href="#contato" className="hover:underline">Contato</a>
          </nav>
        </div>
      </header>

      <section className="bg-green-100 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            Encontre o imóvel dos seus sonhos</motion.h2>
          <p className="text-lg mb-6">Casas, apartamentos e terrenos com as melhores condições do mercado.</p>
          <Button className="bg-green-900 hover:bg-green-800 text-white px-6 py-3 rounded-full text-lg">
            Ver Imóveis
          </Button>
        </div>
      </section>

      <section id="imoveis" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-center mb-12">Nossos Imóveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md">
                <CardContent>
                  <Image
                    src={`/imovel${i}.jpg`}
                    alt={`Imóvel ${i}`}
                    width={500}
                    height={300}
                    className="rounded-lg mb-4"
                  />
                  <h4 className="text-xl font-bold mb-2">Casa Exemplo {i}</h4>
                  <p className="text-green-900 mb-2">3 quartos • 2 banheiros • 120m²</p>
                  <p className="font-semibold">R$ 450.000</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="py-16 bg-green-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-semibold mb-4">Sobre a Ca Imóveis</h3>
          <p className="text-lg">
            Com anos de experiência no mercado, a Ca Imóveis é especializada em proporcionar o melhor atendimento e as melhores ofertas de imóveis para compra e aluguel.
          </p>
        </div>
      </section>

      <section id="contato" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-center mb-6">Entre em Contato</h3>
          <form className="space-y-4">
            <input type="text" placeholder="Nome" className="w-full border p-3 rounded-md" />
            <input type="email" placeholder="Email" className="w-full border p-3 rounded-md" />
            <textarea placeholder="Mensagem" rows={5} className="w-full border p-3 rounded-md" />
            <Button className="bg-green-900 hover:bg-green-800 text-white px-6 py-3 rounded-full">
              Enviar
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-green-900 text-white text-center py-6 mt-12">
        <p>&copy; {new Date().getFullYear()} Ca Imóveis. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
