'use client';

import React, { useState } from 'react';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import LoginModal from './LoginModal';

const Rodape = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-bl from-green-950 to-black text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
          {/* Onde Estamos */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Onde Estamos</h3>
            <p>Rua R. Felipe Schmidt, 945 - Centro</p>
            <p>Mafra - SC, 89300-074</p>
          </div>

          {/* Mídias Sociais */}
          <div className="flex flex-col items-start md:items-center">
            <h3 className="font-semibold text-lg mb-2 text-center">Mídias Sociais</h3>
            <div className="flex justify-center space-x-6 mt-2">
              <a
                href="https://www.instagram.com/imobiliariacaimoveis/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-2xl hover:text-green-300 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Nossos Contatos */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="font-semibold text-lg mb-2">Nossos Contatos</h3>
            <p className="flex items-center gap-2">
              <FaWhatsapp className="text-green-400" />
              <a
                href="https://wa.me/554791648594"
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

          {/* Criado por */}
          <div className="col-span-1 md:col-span-3 text-center mt-6">
            <p>
              Criado por{' '}
              <a
                href="https://www.instagram.com/edu_reichardt/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-300"
              >
                EduReichardt
              </a>
            </p>
          </div>
        </div>

        {/* Rodapé inferior com CRECI e botão de login */}
        <div className="max-w-7xl mx-auto px-4 mt-6 text-sm text-green-300 flex justify-between items-center">
          <p className="flex items-center gap-2">
            🔑 CRECI - SC 58624
          </p>

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
