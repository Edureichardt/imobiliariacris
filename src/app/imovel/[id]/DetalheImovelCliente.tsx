'use client';

import { useState } from 'react';
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  CircleDollarSign,
  Share2,
  X,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

export interface Foto {
  id: string;
  url: string;
}

export interface Imovel {
  id: string;
  tipo: string;
  operacao: string;
  endereco: string;
  bairro: string;
  cidade: string;
  preco: number;
  descricao?: string;
  quartos?: number;
  banheiros?: number;
  area?: number;
  fotos: Foto[];
  tourUrl?: string;
}

function ModalImagens({
  fotos,
  fotoAtualIndex,
  setFotoAtualIndex,
  fecharModal,
}: {
  fotos: Foto[];
  fotoAtualIndex: number;
  setFotoAtualIndex: (index: number) => void;
  fecharModal: () => void;
}) {
  const [zoom, setZoom] = useState(false);
  const totalFotos = fotos.length;

  const irProximo = () => {
    setZoom(false);
    setFotoAtualIndex((fotoAtualIndex + 1) % totalFotos);
  };

  const irAnterior = () => {
    setZoom(false);
    setFotoAtualIndex((fotoAtualIndex - 1 + totalFotos) % totalFotos);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      {/* Botão fechar */}
      <button
        onClick={fecharModal}
        className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-700 transition"
        aria-label="Fechar modal"
      >
        <X size={32} />
      </button>

      {/* Imagem grande */}
      <div
        className={`relative max-w-[90vw] max-h-[80vh] flex items-center justify-center overflow-hidden`}
      >
        <img
          src={fotos[fotoAtualIndex].url}
          alt={`Foto ${fotoAtualIndex + 1}`}
          className={`cursor-zoom-${zoom ? 'out' : 'in'} transition-transform duration-300 select-none ${
            zoom ? 'scale-150' : 'scale-100'
          }`}
          draggable={false}
          onClick={() => setZoom(!zoom)}
          style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain' }}
        />

        {/* Botões navegação */}
        <button
          onClick={irAnterior}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-80 transition select-none"
          aria-label="Imagem anterior"
        >
          ‹
        </button>
        <button
          onClick={irProximo}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-80 transition select-none"
          aria-label="Próxima imagem"
        >
          ›
        </button>

        {/* Botão zoom */}
        <button
          onClick={() => setZoom(!zoom)}
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition select-none"
          aria-label={zoom ? 'Diminuir zoom' : 'Aumentar zoom'}
          title={zoom ? 'Diminuir zoom' : 'Aumentar zoom'}
          type="button"
        >
          🔍
        </button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 mt-4 overflow-x-auto max-w-[90vw]">
        {fotos.map((foto, index) => (
          <button
            key={foto.id}
            onClick={() => {
              setFotoAtualIndex(index);
              setZoom(false);
            }}
            className={`border-2 rounded-lg overflow-hidden flex-shrink-0 w-20 h-20 transition-transform ${
              fotoAtualIndex === index
                ? 'border-green-900 scale-110'
                : 'border-transparent'
            }`}
            type="button"
            aria-label={`Ver foto ${index + 1}`}
          >
            <img
              src={foto.url}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DetalheImovelCliente({ imovel }: { imovel: Imovel }) {
  const [fotoAtual, setFotoAtual] = useState(imovel.fotos[0]?.url || '');
  const [modalAberto, setModalAberto] = useState(false);
  const [fotoModalIndex, setFotoModalIndex] = useState(0);

  const zapNumeroDono = '554791648594'; // número do dono da imobiliária
  const mensagemZapDono = `Olá, gostaria de mais informações sobre o imóvel: ${imovel.tipo} para ${imovel.operacao}, localizado em ${imovel.endereco}, ${imovel.bairro} - ${imovel.cidade}, com preço de R$ ${imovel.preco.toLocaleString(
    'pt-BR'
  )}.`;

  const mensagemCompartilhar = `Confira este imóvel: ${imovel.tipo} para ${imovel.operacao} em ${imovel.cidade}.\nPreço: R$ ${imovel.preco.toLocaleString(
    'pt-BR'
  )}\n${imovel.endereco}, ${imovel.bairro}\nVeja as fotos e detalhes!`;

  const linkImovel = typeof window !== 'undefined' ? window.location.href : '';

  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    mensagemCompartilhar + '\n' + linkImovel
  )}`;

  const instagramPerfil = 'https://www.instagram.com/ca_imoveisbr/';

  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    linkImovel
  )}`;

  const abrirModal = (url: string) => {
    const index = imovel.fotos.findIndex((foto) => foto.url === url);
    setFotoModalIndex(index >= 0 ? index : 0);
    setModalAberto(true);
  };

  const abrirModalTodasFotos = () => {
    setFotoModalIndex(0);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  // Endereço codificado para o Google Maps
  const enderecoParaMapa = encodeURIComponent(
    `${imovel.endereco}, ${imovel.bairro}, ${imovel.cidade}`
  );

  return (
    <main className="w-full p-6 bg-white">
      <div className="mb-6">
        <a
          href="/"
          className="inline-block bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded transition"
        >
          Tela inicial
        </a>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-green-900">
        {imovel.tipo.toUpperCase()} para {imovel.operacao}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Galeria */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-lg border border-green-800 group">
            <img
              src={fotoAtual}
              alt="Foto principal"
              className="w-full h-[350px] object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
              onClick={() => abrirModal(fotoAtual)}
              draggable={false}
            />
          </div>

          <div className="flex gap-4 mt-4 overflow-x-auto">
            {imovel.fotos.slice(0, 4).map((foto) => (
              <button
                key={foto.id}
                onClick={() => setFotoAtual(foto.url)}
                className={`border-2 rounded-lg overflow-hidden flex-shrink-0 w-24 h-24 transition-transform ${
                  fotoAtual === foto.url ? 'border-green-900 scale-105' : 'border-transparent'
                }`}
                type="button"
              >
                <img
                  src={foto.url}
                  alt="Miniatura"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}

            {imovel.fotos.length > 5 && (
              <button
                onClick={() => abrirModal(imovel.fotos[4].url)}
                className="relative border-2 rounded-lg flex-shrink-0 w-24 h-24 border-transparent bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold"
                type="button"
              >
                <img
                  src={imovel.fotos[4].url}
                  alt="Miniatura"
                  className="w-full h-full object-cover opacity-60"
                  draggable={false}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  +{imovel.fotos.length - 5}
                </div>
              </button>
            )}

            {imovel.fotos.length === 5 && (
              <button
                key={imovel.fotos[4].id}
                onClick={() => setFotoAtual(imovel.fotos[4].url)}
                className={`border-2 rounded-lg overflow-hidden flex-shrink-0 w-24 h-24 transition-transform ${
                  fotoAtual === imovel.fotos[4].url ? 'border-green-900 scale-105' : 'border-transparent'
                }`}
                type="button"
              >
                <img
                  src={imovel.fotos[4].url}
                  alt="Miniatura"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            )}
          </div>

          {imovel.tourUrl && (
            <section className="mt-6">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Tour pelo imóvel</h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-green-800 shadow-md">
                <iframe
                  src={imovel.tourUrl}
                  title="Tour pelo imóvel"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder="0"
                />
              </div>
            </section>
          )}

          {/* MAPA */}
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Localização</h3>
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-green-800 shadow-md">
              <iframe
                src={`https://www.google.com/maps?q=${enderecoParaMapa}&output=embed`}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
                title="Mapa do imóvel"
                frameBorder="0"
              />
            </div>
          </section>
        </div>

        {/* Dados do imóvel */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Botão "Mais Informações" */}
          <div>
            <a
              href={`https://api.whatsapp.com/send?phone=${zapNumeroDono}&text=${encodeURIComponent(
                mensagemZapDono
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 px-6 py-3 bg-green-900 hover:bg-green-800 text-white rounded-full font-semibold transition"
            >
              Mais Informações
            </a>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Ficha técnica</h2>
            {/* DESCRIÇÃO ACIMA */}
            {imovel.descricao && (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{imovel.descricao}</p>
            )}
            <div className="flex items-center gap-2 text-green-900 mb-2">
              <CircleDollarSign size={24} />
              <span className="text-2xl font-bold">
                R$ {imovel.preco.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-900 mb-2">
              <MapPin size={20} />
              <span>
                {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
              </span>
            </div>
            <div className="flex gap-6 text-green-900 mb-4">
              {imovel.quartos !== undefined && (
                <div className="flex items-center gap-1">
                  <BedDouble size={20} />
                  <span>{imovel.quartos} quartos</span>
                </div>
              )}
              {imovel.banheiros !== undefined && (
                <div className="flex items-center gap-1">
                  <Bath size={20} />
                  <span>{imovel.banheiros} banheiros</span>
                </div>
              )}
              {imovel.area !== undefined && (
                <div className="flex items-center gap-1">
                  <Ruler size={20} />
                  <span>{imovel.area} m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Compartilhar */}
          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Compartilhar</h2>
            <div className="flex gap-4">
              <a
                href={whatsappShareLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no WhatsApp"
                className="text-green-900 hover:text-green-700 text-3xl"
              >
                <FaWhatsapp />
              </a>
              <a
                href={instagramPerfil}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Perfil no Instagram"
                className="text-pink-600 hover:text-pink-500 text-3xl"
              >
                <FaInstagram />
              </a>
              <a
                href={facebookShareLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no Facebook"
                className="text-blue-700 hover:text-blue-600 text-3xl"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagens */}
      {modalAberto && (
        <ModalImagens
          fotos={imovel.fotos}
          fotoAtualIndex={fotoModalIndex}
          setFotoAtualIndex={setFotoModalIndex}
          fecharModal={fecharModal}
        />
      )}
    </main>
  );
}
