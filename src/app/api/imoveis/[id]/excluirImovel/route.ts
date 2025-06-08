import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(request: NextRequest) {
  const url = request.nextUrl;
  // O pathname deve ser algo como /api/imoveis/{id}/excluirImovel
  // Vamos extrair o id do pathname:
  const match = url.pathname.match(/\/api\/imoveis\/([^\/]+)\/excluirImovel/);
  const id = match ? match[1] : null;

  if (!id) {
    return NextResponse.json(
      { message: 'ID do imóvel não fornecido' },
      { status: 400 }
    );
  }

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { id },
    });

    if (!imovel) {
      return NextResponse.json(
        { message: 'Imóvel não encontrado' },
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
      { message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
