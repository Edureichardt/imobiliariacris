import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      where: {
        destaque: true,
        ativo: true,
      },
      select: {
        id: true,
        endereco: true,
        destaque: true,
        ativo: true,
        criadoEm: true,
      },
    });

    return NextResponse.json({ total: imoveis.length, imoveis });
  } catch (error) {
    console.error('Erro no teste:', error);
    return NextResponse.json({ error: 'Erro na API de teste' }, { status: 500 });
  }
}
