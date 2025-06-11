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

    const destaquesFiltrados = destaques.map(imovel => {
      const fotosValidas =
        Array.isArray(imovel.fotos) && imovel.fotos.length > 0
          ? imovel.fotos
              .filter(f => typeof f.url === 'string' && f.url.trim() !== '')
              .map(f => f.url)
          : [];

      return {
        id: imovel.id,
        operacao: imovel.operacao,
        descricao: imovel.descricao,
        tipo: imovel.tipo,
        cidade: imovel.cidade,
        bairro: imovel.bairro,
        endereco: imovel.endereco,
        preco: imovel.preco,
        criadoEm: imovel.criadoEm,
        ativo: imovel.ativo,
        destaque: imovel.destaque,
        tourUrl: imovel.tourUrl || null,
        fotos: fotosValidas,
      };
    });

    return NextResponse.json(destaquesFiltrados, {
  headers: {
    'Cache-Control': 'no-store',
  },
});

  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json({ error: 'Erro ao buscar destaques' }, { status: 500 });
  }
}
