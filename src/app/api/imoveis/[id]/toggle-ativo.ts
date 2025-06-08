import type { NextApiRequest, NextApiResponse } from 'next';
import { getImovelById, updateImovel } from '@/app/lib/imoveis';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const { id } = req.query;

  if (typeof id !== 'string') return res.status(400).json({ message: 'ID inválido' });

  try {
    const imovel = await getImovelById(id);
    if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado' });

    const atualizado = await updateImovel(id, { ativo: !imovel.ativo });
    res.status(200).json(atualizado);
  } catch (error) {
    console.error('Erro ao alternar ativo:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar imóvel' });
  }
}
