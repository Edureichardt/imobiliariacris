'use client'
import React, { useState } from 'react';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import LoginModal from './LoginModal';

const Triangle = () => (
  <svg
    className="mr-2 mt-[3px] h-3 w-3 flex-shrink-0 text-white"
    fill="currentColor"
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0L8 4L0 8V0Z" />
  </svg>
);

const SimpleUnderlineTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-white text-xl font-semibold relative inline-block mb-4">
    {children}
    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white opacity-40 rounded" />
  </h3>
);

const Rodape = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-bl from-green-950 to-black text-white py-12
">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Nossa Marca */}
          <div className="flex flex-col items-start space-y-2">
            <SimpleUnderlineTitle>Nossa Marca</SimpleUnderlineTitle>
            <img
              src="/logo1.png"
              alt="CA Imóveis Logo"
              width={110}
              height={70}
              className="object-contain"
            />
            <span className="text-white text-lg font-semibold lowercase tracking-wide -mt-1">
              ca imóveis
            </span>
            <span className="text-green-300 italic text-sm font-light">Sinta-se em casa</span>
          </div>

          {/* Links do Site */}
          <div className="flex flex-col">
            <SimpleUnderlineTitle>Links do Site</SimpleUnderlineTitle>
            <ul className="space-y-3">
              {['Início', 'Imóveis', 'Contato', 'Anuncie seu imóvel'].map((link) => {
                let href = '/';
                let isExternal = false;

                if (link === 'Imóveis') href = '/buscar';
                else if (link === 'Contato') href = '/contato';
                else if (link === 'Anuncie seu imóvel') {
                  href = 'https://wa.me/554791648594';
                  isExternal = true;
                }

                return (
                  <li
                    key={link}
                    className="flex items-center hover:text-green-400 cursor-pointer transition"
                  >
                    <Triangle />
                    {isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    ) : (
                      <a href={href}>{link}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Onde Estamos */}
          <div className="flex flex-col">
            <SimpleUnderlineTitle>Onde Estamos</SimpleUnderlineTitle>
            <p>Rua R. Felipe Schmidt, 945 - Centro</p>
            <p>Mafra - SC, 89300-074</p>
          </div>

          {/* Entre em Contato */}
          <div className="flex flex-col">
            <SimpleUnderlineTitle>Entre em Contato</SimpleUnderlineTitle>
            <p className="flex items-center gap-2">
              <FaWhatsapp className="text-green-400" />
              <a
                href="https://wa.me/55479991648594"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-green-300"
              >
                (47) 99164-8594
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-green-400" />
              <a
                href="mailto:caimoveis01@gmail.com"
                className="hover:underline hover:text-green-300"
              >
                caimoveis01@gmail.com
              </a>
            </p>
          </div>

          {/* Mídias Sociais */}
          <div className="flex flex-col items-start md:items-center">
            <SimpleUnderlineTitle>Nossas Redes</SimpleUnderlineTitle>
            <div className="flex space-x-6 mt-2 text-3xl">
              <a
                href="https://www.instagram.com/imobiliariacaimoveis/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white hover:text-green-300 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Desenvolvido por */}
        <div className="max-w-7xl mx-auto px-4 mt-10 text-center text-green-300 text-sm font-semibold">
          Desenvolvido por{' '}
          <a
            href="https://www.instagram.com/edu_reichardt/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-400"
          >
            EduReichardt
          </a>
        </div>

        {/* Rodapé inferior com CRECI e botão de login */}
        <div className="max-w-7xl mx-auto px-4 mt-6 text-sm text-green-300 flex justify-between items-center">
          <p className="flex items-center gap-2">🔑 CRECI - SC 10719J</p>

          <button
            onClick={() => setShowLogin(true)}
            aria-label="Área Administrativa"
            className="text-green-300 hover:text-green-100 text-2xl"
            title="Área Administrativa"
          >
            🔒
          </button>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Rodape;