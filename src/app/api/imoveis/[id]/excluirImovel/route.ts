import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { id },
    });

    if (!imovel) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }

    await prisma.foto.deleteMany({
      where: { imovelId: id },
    });

    await prisma.imovel.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Imóvel excluído com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
