import formidable from 'formidable';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';  // ajuste o caminho conforme seu projeto

export const config = {
  api: {
    bodyParser: false, // desabilita parser padrão para usar formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro no formidable:', err);
      return res.status(500).json({ error: 'Erro no processamento dos arquivos' });
    }

    try {
      // Upload das fotos
      const fotos = files.fotos ? (Array.isArray(files.fotos) ? files.fotos : [files.fotos]) : [];
      const uploadedFotos = [];

      for (const file of fotos) {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'imoveis',
        });
        uploadedFotos.push(result.secure_url);
      }

      // Upload do vídeo (se enviado)
      let uploadedVideoUrl = null;
      if (files.video) {
        const resultVideo = await cloudinary.uploader.upload(files.video.filepath, {
          folder: 'imoveis',
          resource_type: 'video',
        });
        uploadedVideoUrl = resultVideo.secure_url;
      }

      // Parse campos que precisam de conversão, ex: preço
      const precoNumerico = parseFloat(
        fields.preco.replace(/[^\d,]/g, '').replace(',', '.')
      );

      // Criar imóvel no banco
      const novoImovel = await prisma.imovel.create({
        data: {
          operacao: fields.operacao,
          descricao: fields.descricao,
          tipo: fields.tipo,
          cidade: fields.cidade,
          bairro: fields.bairro,
          endereco: fields.endereco,
          preco: precoNumerico,
          destaque: fields.destaque === 'true' || fields.destaque === true, // converte para boolean
          tourUrl: uploadedVideoUrl,
          fotos: {
            create: uploadedFotos.map(url => ({ url })),
          },
        },
        include: { fotos: true },
      });

      return res.status(201).json({
        success: true,
        imovel: novoImovel,
      });
    } catch (uploadError) {
      console.error('Erro no upload ou criação:', uploadError);
      return res.status(500).json({ error: 'Erro no upload ou criação do imóvel' });
    }
  });
}

