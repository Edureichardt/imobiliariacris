import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('PATCH recebido para id:', params.id);
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'ID do imóvel não fornecido' }, { status: 400 });
  }

  try {
    const imovelAtual = await prisma.imovel.findUnique({ where: { id } });

    if (!imovelAtual) {
      return NextResponse.json({ message: 'Imóvel não encontrado' }, { status: 404 });
    }

    const imovelAtualizado = await prisma.imovel.update({
      where: { id },
      data: { ativo: !imovelAtual.ativo },
    });

    return NextResponse.json({ ativo: imovelAtualizado.ativo });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao atualizar imóvel' }, { status: 500 });
  }
}
