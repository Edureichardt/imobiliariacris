import { prisma } from '../../../lib/prisma';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const destaques = await prisma.imovel.findMany({
      where: {
        destaque: true,
        ativo: true, // opcional: só mostrar ativos
      },
      orderBy: {
        criadoEm: 'desc',
      },
      include: {
        fotos: true, // importante para aparecerem as imagens
      },
    });

    const destaquesFiltrados = destaques.map(imovel => ({
      ...imovel,
      fotos: imovel.fotos.filter(f => f.url && f.url.trim() !== ''),
    }));

    return NextResponse.json(destaquesFiltrados);
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    return NextResponse.json({ error: 'Erro ao buscar destaques' }, { status: 500 });
  }
}
