'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const frases = [
  'Buscando os melhores imóveis...',
  'Verificando disponibilidade...',
  'Preparando as imagens...',
  'Organizando os detalhes...',
  'Quase lá...'
];

export default function Loading() {
  const [indiceFrase, setIndiceFrase] = useState(0);
  const [cliques, setCliques] = useState(0);
  const [posicao, setPosicao] = useState({ top: '40%', left: '40%' });

  // Troca a frase a cada 2.5s
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceFrase((prev) => (prev + 1) % frases.length);
    }, 2500);
    return () => clearInterval(intervalo);
  }, []);

  // Função para mover o quadrado para posição aleatória
  function moverQuadrado() {
    const top = Math.floor(Math.random() * 70) + 10; // entre 10% e 80%
    const left = Math.floor(Math.random() * 70) + 10;
    setPosicao({ top: `${top}%`, left: `${left}%` });
    setCliques((c) => c + 1);
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-60 text-green-900 animate-fade-in select-none">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      <p className="text-center text-sm font-medium transition-all duration-500 mb-4">
        {frases[indiceFrase]}
      </p>

      <div
        onClick={moverQuadrado}
        style={{ top: posicao.top, left: posicao.left }}
        className="absolute w-12 h-12 bg-green-700 rounded-md shadow-lg cursor-pointer hover:bg-green-900 transition"
        title="Clique aqui!"
      />

      <p className="mt-16 text-xs italic">
        Você clicou {cliques} vez{cliques !== 1 ? 'es' : ''}
      </p>
    </div>
  );
}
