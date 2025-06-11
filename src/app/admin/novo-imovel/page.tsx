"use client";

import { useState, useRef } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export default function CadastroImovel() {
  const [form, setForm] = useState({
    operacao: '',
    descricao: '',
    tipo: '',
    cidade: '',
    bairro: '',
    endereco: '',
    preco: '',
    fotos: [] as string[],
    destaque: false,
    tourUrl: '',
  });

  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [message, setMessage] = useState('');

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (type === 'checkbox' && 'checked' in target) {
      setForm(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
    } else if (name === 'preco') {
      const raw = value.replace(/[^\d]/g, '');
      const num = parseFloat(raw) / 100;
      const formatado = isNaN(num)
        ? ''
        : num.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
      setForm(prev => ({ ...prev, [name]: formatado }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = descricaoRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.descricao;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    setForm(prev => ({ ...prev, descricao: newText }));

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target.files instanceof FileList)) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFoto(true);
    setMessage('');

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) throw new Error(data.error || 'Falha no upload');
          if (!data.url) throw new Error('URL da imagem não retornada');

          return data.url as string;
        })
      );

      setForm(prev => ({ ...prev, fotos: [...prev.fotos, ...uploaded] }));
      setMessage('Fotos enviadas com sucesso!');
    } catch (error) {
      setMessage((error as Error).message || 'Erro ao enviar imagens.');
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    

  if (!(e.target.files instanceof FileList)) return;
  const file = e.target.files[0];
  if (!file) return;

  // Verifica tipo e tamanho
  if (!file.type.startsWith('video/')) {
    setMessage('Por favor, envie um arquivo de vídeo.');
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    setMessage('O vídeo deve ter no máximo 100MB.');
    return;
  }

  setUploadingVideo(true);
  setMessage('');

  try {
    const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dkh7chlyx/video/upload';
    const UPLOAD_PRESET = 'Uploadimoveis';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Erro ao enviar vídeo para o Cloudinary.');
    }
  
    setForm(prev => ({ ...prev, tourUrl: data.secure_url }));
    setMessage('Vídeo enviado com sucesso!');
  } catch (error) {
    setMessage((error as Error).message || 'Erro ao enviar vídeo.');
  } finally {
    setUploadingVideo(false);
  }
};
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (form.fotos.length === 0) {
      setMessage('Por favor, envie ao menos uma foto.');
      return;
    }

    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('Imóvel cadastrado com sucesso!');
        setForm({
          operacao: '',
          descricao: '',
          tipo: '',
          cidade: '',
          bairro: '',
          endereco: '',
          preco: '',
          fotos: [],
          destaque: false,
          tourUrl: '',
        });
      } else {
        setMessage('Erro ao cadastrar imóvel.');
      }
    } catch (error) {
      setMessage('Erro ao cadastrar imóvel.');
      console.error('Erro no fetch:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Imóvel</h1>
      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Operação</label>
          <select
            name="operacao"
            value={form.operacao}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione</option>
            <option value="comprar">Comprar</option>
            <option value="alugar">Alugar</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Descrição</label>
          <div className="relative">
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              ref={descricaoRef}
              className="w-full border p-2 rounded resize-y"
              rows={4}
            />
            <button
              type="button"
              onClick={() => setEmojiPickerOpen(open => !open)}
              className="absolute right-2 bottom-2 text-xl"
              aria-label="Adicionar emoji"
            >
              😊
            </button>
            {emojiPickerOpen && (
              <div className="absolute z-50 top-full right-0 mt-1 shadow-lg rounded bg-white">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  height={300}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="sítio">Sítio</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Preço</label>
          <input
            type="text"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Fotos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {uploadingFoto && (
            <p className="text-sm text-gray-500 mt-2">Enviando fotos...</p>
          )}
          {form.fotos.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Fotos enviadas:</p>
              <div className="flex flex-wrap gap-2">
                {form.fotos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold">Vídeo Tour</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border p-2 rounded"
          />
          {uploadingVideo && (
            <p className="text-sm text-gray-500 mt-2">Enviando vídeo...</p>
          )}
          {form.tourUrl && (
            <video
              src={form.tourUrl}
              controls
              className="mt-4 w-full max-h-64 rounded"
            />
          )}
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="destaque"
              checked={form.destaque}
              onChange={handleChange}
              className="mr-2"
            />
            Destaque
          </label>
        </div>

        <button
          type="submit"
          disabled={uploadingFoto || uploadingVideo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Cadastrar Imóvel
        </button>
      </form>
    </div>
  );
}
