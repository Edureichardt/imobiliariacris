import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Tipagem correta para rotas dinâmicas
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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


