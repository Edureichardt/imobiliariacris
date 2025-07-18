import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tipo = searchParams.get('tipo');
    const cidade = searchParams.get('cidade');
    const bairro = searchParams.get('bairro');
    const operacao = searchParams.get('operacao');
    const endereco = searchParams.get('endereco');
    const valorMin = searchParams.get('valorMin');
    const valorMax = searchParams.get('valorMax');

    const filtros: any = {};

    if (tipo && tipo.trim() !== '') {
      filtros.tipo = {
        equals: tipo,
        mode: 'insensitive',
      };
    }

    if (cidade && cidade.trim() !== '') {
      filtros.cidade = {
        contains: cidade,
        mode: 'insensitive',
      };
    }

    if (bairro && bairro.trim() !== '') {
      filtros.bairro = {
        contains: bairro,
        mode: 'insensitive',
      };
    }

    if (operacao && operacao.trim() !== '') {
      filtros.operacao = {
        equals: operacao,
        mode: 'insensitive',
      };
    }

    if (endereco && endereco.trim() !== '') {
      filtros.endereco = {
        contains: endereco,
        mode: 'insensitive',
      };
    }

    // Filtra faixa de preço
    if (valorMin && valorMin.trim() !== '') {
      const valorMinNum = parseFloat(valorMin);
      if (!isNaN(valorMinNum)) {
        filtros.preco = {
          ...filtros.preco,
          gte: valorMinNum,
        };
      }
    }
    if (valorMax && valorMax.trim() !== '') {
      const valorMaxNum = parseFloat(valorMax);
      if (!isNaN(valorMaxNum)) {
        filtros.preco = {
          ...filtros.preco,
          lte: valorMaxNum,
        };
      }
    }

    const imoveis = await prisma.imovel.findMany({
      where: filtros,
      orderBy: {
        preco: 'asc',
      },
      include: {
        fotos: true, // aqui traz as fotos relacionadas
      },
    });

    return NextResponse.json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
