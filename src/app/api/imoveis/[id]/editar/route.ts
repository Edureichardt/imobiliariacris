import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';


interface Params {
  params: {
    id: string;
  };
}

// GET - buscar imóvel por id
export async function GET(req: Request, { params }: Params) {
  try {
    const id = params.id;

    const imovel = await prisma.imovel.findUnique({
      where: { id },
      include: { fotos: true }, // incluir fotos, caso tenha relacionamento
    });

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json(imovel);
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóvel' }, { status: 500 });
  }
}

// PUT - atualizar imóvel por id
export async function PUT(req: Request, { params }: Params) {
  try {
    const id = params.id;
    const data = await req.json();

    // Validação simples, ajuste conforme seus campos
    if ( !data.descricao || !data.preco) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const precoNumerico = Number(data.preco);
    if (isNaN(precoNumerico)) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 });
    }

    const imovelAtualizado = await prisma.imovel.update({
      where: { id },
      data: {
        
        descricao: data.descricao,
        preco: precoNumerico,
        tipo: data.tipo,
        // adicione outros campos que quer permitir editar
      },
    });

    return NextResponse.json(imovelAtualizado);
  } catch (error) {
    console.error('Erro ao editar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao editar imóvel' }, { status: 500 });
  }
}
