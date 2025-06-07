'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function Contato() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    mensagem: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="min-h-screen bg-white p-6 text-green-900 w-full mx-auto">
      <button
        onClick={() => router.push('/')}
        className="mb-6 bg-green-900 text-white px-5 py-2 rounded-full hover:bg-green-800 transition"
      >
        &larr; Tela inicial
      </button>

      <h1 className="text-4xl font-bold mb-8">Entre em Contato</h1>

      <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
        <iframe
          title="Localização"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.366021704749!2d-49.808127725410834!3d-26.1196061771288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dd93228feb3121%3A0x49d43f0ddbae5d76!2sR.%20Felipe%20Schmidt%2C%20945%20-%20centro%2C%20Mafra%20-%20SC%2C%2089300-074!5e0!3m2!1spt-BR!2sbr!4v1748112282939!5m2!1spt-BR!2sbr"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="bg-green-50 rounded-xl p-6 mb-10 shadow">
        <p className="mb-3 flex items-center gap-2">
          <FaWhatsapp className="text-green-600" />
          <strong>WhatsApp: </strong>
          <a
            href="https://wa.me/554791648594"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 underline hover:text-green-600"
          >
            +55 47 9164-8594
          </a>
        </p>
        <p className="mb-3 flex items-center gap-2">
          <FaInstagram className="text-pink-600" />
          <strong>Instagram: </strong>
          <a
            href="https://www.instagram.com/ca_imoveisbr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 underline hover:text-green-600"
          >
            @ca_imoveisbr
          </a>
        </p>
        <p className="italic text-gray-600">
          Para mais praticidade, fale conosco pelo WhatsApp ou Instagram!
        </p>
      </div>

      <div className="bg-green-50 rounded-xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block font-semibold mb-1">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-800"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block font-semibold mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              value={formData.telefone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-800"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-800"
            />
          </div>

          <div>
            <label htmlFor="mensagem" className="block font-semibold mb-1">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              rows={4}
              value={formData.mensagem}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-800"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-green-900 text-white px-6 py-3 rounded-full hover:bg-green-800 transition w-full"
          >
            Enviar
          </button>

          {enviado && (
            <p className="text-green-700 font-semibold mt-4">
              ✅ Sua mensagem foi enviada com sucesso!
            </p>
          )}
        </form>
      </div>
    </main>
  );
}


