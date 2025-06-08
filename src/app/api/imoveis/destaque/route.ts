import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const destaques = await prisma.imovel.findMany({
      where: {
        destaque: true,
        ativo: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
      include: {
        fotos: true,
      },
    });

    const destaquesFiltrados = destaques.map(imovel => ({
      ...imovel,
      fotos: Array.isArray(imovel.fotos)
        ? imovel.fotos.filter(f => f.url && f.url.trim() !== '')
        : [],
    }));

    return NextResponse.json(destaquesFiltrados);
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json({ error: 'Erro ao buscar destaques' }, { status: 500 });
  }
}
