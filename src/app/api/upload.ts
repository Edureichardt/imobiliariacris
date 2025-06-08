import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { File } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao parsear:', err);
      return res.status(500).json({ error: 'Erro ao fazer upload.' });
    }

    const image = files.image;
    const file = Array.isArray(image) ? image[0] : image;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'Imagem não encontrada.' });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'imoveis',
      });

      fs.unlinkSync(file.filepath); // limpa o arquivo temporário
      return res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: 'Erro ao enviar para Cloudinary.' });
    }
  });
}
