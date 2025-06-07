'use client';

import { useState } from 'react';

interface UploadImageProps {
  onUploadComplete: (urls: string[]) => void;
}

export default function UploadImage({ onUploadComplete }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Selecione uma imagem primeiro.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.error || 'Erro ao fazer upload';
        throw new Error(message);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error('URL não retornada pela API');
      }

      onUploadComplete([data.url]);
      alert('Upload feito com sucesso!');
      setPreview(null);
      setFile(null);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert((error as Error).message || 'Erro no upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-64 h-auto rounded shadow"
          style={{ maxHeight: 300 }}
        />
      )}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 text-white rounded ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Enviando...' : 'Enviar Imagem'}
      </button>
    </div>
  );
}
