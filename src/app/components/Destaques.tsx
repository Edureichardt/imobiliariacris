'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Imovel = {
  id: number;
  tipo: string;
  descricao: string;
  bairro: string;
  preco: number;
  fotos: string[];
};

export default function Destaques() {
  const [destaques, setDestaques] = useState<Imovel[]>([]);

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        const res = await fetch('/api/imoveis/destaque');
        const data = await res.json();
        setDestaques(data);
      } catch (error) {
        console.error('Erro ao buscar destaques:', error);
      }
    };

    fetchDestaques();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-semibold text-center mb-12">Imóveis em Destaque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destaques.map((imovel) => (
            <div key={imovel.id} className="border rounded-lg shadow-md overflow-hidden">
              <Image
                src={imovel.fotos[0] || 'https://via.placeholder.com/500x300?text=Sem+Imagem'}
                alt={imovel.tipo}
                width={500}
                height={300}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold mb-2">{imovel.tipo} - {imovel.bairro}</h4>
                <p className="mb-2">{imovel.descricao}</p>
                <p className="font-semibold text-green-800">R$ {imovel.preco.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
