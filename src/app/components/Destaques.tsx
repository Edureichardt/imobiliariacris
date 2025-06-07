'use client';

import Image from 'next/image';

const destaques = [
  {
    id: 1,
    titulo: 'Casa Moderna no Centro',
    descricao: '3 quartos • 2 banheiros • 150m²',
    preco: 'R$ 500.000',
    imagem: 'https://via.placeholder.com/500x300?text=Destaque+1',
  },
  {
    id: 2,
    titulo: 'Apartamento com Vista',
    descricao: '2 quartos • 1 banheiro • 80m²',
    preco: 'R$ 350.000',
    imagem: 'https://via.placeholder.com/500x300?text=Destaque+2',
  },
  {
    id: 3,
    titulo: 'Terreno Amplo',
    descricao: '500m² • Bairro tranquilo',
    preco: 'R$ 200.000',
    imagem: 'https://via.placeholder.com/500x300?text=Destaque+3',
  },
];

export default function Destaques() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-center mb-12">Imóveis em Destaque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destaques.map((imovel) => (
            <div key={imovel.id} className="border rounded-lg shadow-md overflow-hidden">
              <Image
                src={imovel.imagem}
                alt={imovel.titulo}
                width={500}
                height={300}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold mb-2">{imovel.titulo}</h4>
                <p className="mb-2">{imovel.descricao}</p>
                <p className="font-semibold text-green-800">{imovel.preco}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
