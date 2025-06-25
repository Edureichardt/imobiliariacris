'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export default function EditarImovel() {
  const params = useParams();
  console.log('params:', params);
const idRaw = params.id;
const id = Array.isArray(idRaw) ? idRaw[0] : idRaw ?? "";


  console.log("ID do imóvel:", id);

  const router = useRouter();

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

  useEffect(() => {
    console.log("ID capturado:", id);
    if (!id) return;

    setMessage('');
    fetch(`/api/imoveis/${id}/editar`)
      .then(async res => {
        if (!res.ok) throw new Error('Imóvel não encontrado');
        return res.json();
      })
      .then(data => {
        const precoFormatado = data.preco
          ? Number(data.preco).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : '';

        setForm({
          operacao: data.operacao || '',
          descricao: data.descricao || '',
          tipo: data.tipo || '',
          cidade: data.cidade || '',
          bairro: data.bairro || '',
          endereco: data.endereco || '',
          preco: precoFormatado,
          fotos: data.fotos || [],
          destaque: data.destaque || false,
          tourUrl: data.tourUrl || '',
        });
      })
      .catch(() => setMessage('Erro ao carregar dados do imóvel.'));
  }, [id]);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'preco') {
      const raw = value.replace(/[^\d]/g, '');
      const num = parseFloat(raw) / 100;
      const formatado = isNaN(num)
        ? ''
        : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      setForm(prev => ({ ...prev, [name]: formatado }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

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
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFoto(true);
    setMessage('');

    try {
      const uploaded = await Promise.all(
        files.map(async file => {
          const formData = new FormData();
          formData.append('image', file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Erro no upload');
          return data.url as string;
        })
      );
      setForm(prev => ({ ...prev, fotos: [...prev.fotos, ...uploaded] }));
    } catch (err: any) {
      setMessage(err.message || 'Erro ao enviar imagens.');
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch('/api/upload-video', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no upload');
      setForm(prev => ({ ...prev, tourUrl: data.url }));
    } catch (err: any) {
      setMessage(err.message || 'Erro ao enviar vídeo.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const removerFoto = (url: string) => {
    setForm(prev => ({ ...prev, fotos: prev.fotos.filter(f => f !== url) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage('');

    const precoNumero = Number(form.preco.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(precoNumero)) return setMessage('Preço inválido.');

    try {
      const res = await fetch(`/api/imoveis/${id}/editar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preco: precoNumero }),
      });

      if (res.ok) {
        setMessage('Imóvel atualizado com sucesso!');
        // opcional: redirecionar depois
        // router.push('/admin/editar-imoveis');
      } else {
        setMessage('Erro ao atualizar imóvel.');
      }
    } catch {
      setMessage('Erro ao atualizar imóvel.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Editar Imóvel</h1>
      {message && <p className="text-sm text-red-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="operacao"
          value={form.operacao}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Tipo de Operação</option>
          <option value="comprar">Comprar</option>
          <option value="alugar">Alugar</option>
        </select>

        <div className="relative">
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            ref={descricaoRef}
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Descrição"
          />
          <button
            type="button"
            onClick={() => setEmojiPickerOpen(prev => !prev)}
            className="absolute right-2 bottom-2"
          >
            😊
          </button>
          {emojiPickerOpen && (
            <div className="absolute z-50 top-full right-0 mt-1 bg-white shadow rounded">
              <EmojiPicker onEmojiClick={onEmojiClick} height={300} />
            </div>
          )}
        </div>

        {/* Select para tipo com opções fixas */}
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione o tipo</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
          <option value="sitio">Sítio</option>
        </select>

        <input
          type="text"
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="bairro"
          value={form.bairro}
          onChange={handleChange}
          placeholder="Bairro"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
          placeholder="Endereço"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="preco"
          value={form.preco}
          onChange={handleChange}
          placeholder="Preço"
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="font-semibold">Fotos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {uploadingFoto && <p className="text-sm text-gray-500 mt-2">Enviando fotos...</p>}
          {form.fotos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.fotos.map((url, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded overflow-hidden border border-gray-300 shadow-sm"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      title={`Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      Sem foto
                    </div>
                  )}
                  <button
                    onClick={() => removerFoto(url)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded px-1 hover:bg-red-700 transition"
                    title="Remover foto"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="font-semibold">Vídeo Tour</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border p-2 rounded"
          />
          {uploadingVideo && <p className="text-sm text-gray-500 mt-2">Enviando vídeo...</p>}
          {form.tourUrl && (
            <video src={form.tourUrl} controls className="mt-4 w-full max-h-64 rounded" />
          )}
        </div>

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

        <button
          type="submit"
          disabled={uploadingFoto || uploadingVideo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Atualizar Imóvel
        </button>
      </form>
    </div>
  );
}
