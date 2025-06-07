'use client';

import Image from 'next/image';

const imoveis = [
  { id: 1, tipo: 'Compra', camada: 1 },
  { id: 2, tipo: 'Compra', camada: 2 },
  { id: 3, tipo: 'Aluguel', camada: 1 },
  { id: 4, tipo: 'Aluguel', camada: 2 },
];

export default function NavegacaoImoveis() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-center mb-8">Imóveis para Comprar e Alugar</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {imoveis.map((item) => (
            <div key={item.id} className="border rounded-lg shadow-md overflow-hidden">
              <Image
                src={`https://via.placeholder.com/500x300?text=Imóvel+${item.tipo}+${item.camada}`}
                alt={`Imóvel ${item.tipo}`}
                width={500}
                height={300}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold mb-2">{item.tipo} - Camada {item.camada}</h4>
                <p className="mb-2">Exemplo de descrição do imóvel.</p>
                <p className="font-semibold text-green-800">R$ 350.000</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
