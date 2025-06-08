import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllImoveis, createImovel } from '@/app/lib/imoveis'; // certifique-se de ter isso implementado

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const todos = await getAllImoveis();
      const admin = req.query.admin === 'true';
      const imoveis = admin ? todos : todos.filter(im => im.ativo);

      return res.status(200).json(imoveis);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { tipo, cidade, bairro, operacao, preco, fotos, destaque } = req.body;

      if (!tipo || !cidade || !operacao || !preco) {
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
      }

      const imovelCriado = await createImovel({
        tipo,
        cidade,
        bairro,
        operacao,
        preco: Number(preco),
        destaque: Boolean(destaque),
        ativo: true,
        fotos, // Array de { url }
      });

      return res.status(201).json(imovelCriado);
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      return res.status(500).json({ message: 'Erro ao criar imóvel' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
