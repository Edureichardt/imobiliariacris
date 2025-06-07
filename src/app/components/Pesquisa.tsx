'use client';

import { useState } from 'react';

export default function Pesquisa() {
  const [tipo, setTipo] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [quartos, setQuartos] = useState('');
  const [vagas, setVagas] = useState('');
  const [metragemMin, setMetragemMin] = useState('');
  const [metragemMax, setMetragemMax] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com a busca real, por enquanto só log:
    console.log({ tipo, cidade, bairro, valorMin, valorMax, quartos, vagas, metragemMin, metragemMax });
    alert('Pesquisa enviada! (implemente a lógica de busca)');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-green-100 p-6 rounded-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <select value={tipo} onChange={e => setTipo(e.target.value)} className="p-2 border rounded">
        <option value="">Tipo</option>
        <option value="casa">Casa</option>
        <option value="apartamento">Apartamento</option>
        <option value="terreno">Terreno</option>
        <option value="comercial">Comercial</option>
        <option value="sitio">Sítio</option>
      </select>

      <select value={cidade} onChange={e => setCidade(e.target.value)} className="p-2 border rounded">
        <option value="">Cidade</option>
        <option value="Rio Negro PR">Rio Negro PR</option>
        <option value="Mafra SC">Mafra SC</option>
      </select>

      <input
        type="text"
        placeholder="Bairro"
        value={bairro}
        onChange={e => setBairro(e.target.value)}
        className="p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Valor Mínimo"
        value={valorMin}
        onChange={e => setValorMin(e.target.value)}
        className="p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Valor Máximo"
        value={valorMax}
        onChange={e => setValorMax(e.target.value)}
        className="p-2 border rounded"
      />

      <select value={quartos} onChange={e => setQuartos(e.target.value)} className="p-2 border rounded">
        <option value="">Quartos</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3+">3+</option>
      </select>

      <select value={vagas} onChange={e => setVagas(e.target.value)} className="p-2 border rounded">
        <option value="">Vagas de Garagem</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2+">2+</option>
      </select>

      <input
        type="number"
        placeholder="Metragem Mínima (m²)"
        value={metragemMin}
        onChange={e => setMetragemMin(e.target.value)}
        className="p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Metragem Máxima (m²)"
        value={metragemMax}
        onChange={e => setMetragemMax(e.target.value)}
        className="p-2 border rounded"
      />

      <button type="submit" className="col-span-full bg-green-900 hover:bg-green-800 text-white rounded py-3 font-semibold transition">
        Buscar
      </button>
    </form>
  );
}
