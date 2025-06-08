import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PATCH(request: NextRequest) {
  // Extrair o `id` do pathname da URL
  const { pathname } = request.nextUrl;
  // Exemplo pathname: /api/imoveis/123/ativar-desativar
  const match = pathname.match(/\/api\/imoveis\/([^\/]+)\/ativar-desativar/);
  const id = match ? match[1] : null;

  if (!id) {
    return NextResponse.json({ message: 'ID do imóvel não fornecido' }, { status: 400 });
  }

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



