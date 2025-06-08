import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const imovelAtual = await prisma.imovel.findUnique({
      where: { id }
    });

    if (!imovelAtual) {
      return NextResponse.json({ message: 'Imóvel não encontrado' }, { status: 404 });
    }

    const imovelAtualizado = await prisma.imovel.update({
      where: { id },
      data: { ativo: !imovelAtual.ativo }
    });

    return NextResponse.json(imovelAtualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao atualizar imóvel' }, { status: 500 });
  }
}
