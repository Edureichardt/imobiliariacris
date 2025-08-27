import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: Request) {
  try {
    console.log('Buscando imóveis com filtros...');
    const { searchParams } = new URL(req.url);

    const tipo = searchParams.get('tipo') || undefined;
    const cidade = searchParams.get('cidade') || undefined;
    const bairro = searchParams.get('bairro') || undefined;
    const operacao = searchParams.get('operacao') || undefined;

    const imoveis = await prisma.imovel.findMany({
      where: {
        ...(tipo && { tipo: { equals: tipo, mode: 'insensitive' } }),
        ...(cidade && { cidade: { equals: cidade, mode: 'insensitive' } }),
        ...(bairro && { bairro: { contains: bairro, mode: 'insensitive' } }),
        ...(operacao && { operacao: { equals: operacao, mode: 'insensitive' } }),
      },
      orderBy: { criadoEm: 'desc' },
      include: { fotos: true },
    });

    const imoveisFiltrados = imoveis.map(imovel => ({
      ...imovel,
      fotos: Array.isArray(imovel.fotos)
        ? imovel.fotos
            .filter(foto => foto.url && foto.url.trim() !== '')
            .map(foto => foto.url)
        : [],
      capa: imovel.capa ?? (Array.isArray(imovel.fotos) && imovel.fotos[0]?.url) ?? null,
    }));

    console.log(`Encontrados ${imoveisFiltrados.length} imóveis`);
    return NextResponse.json(imoveisFiltrados);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Recebendo dados para cadastro:', body);

    const precoString = typeof body.preco === 'string' ? body.preco : String(body.preco ?? '');
    const precoNumerico = parseFloat(precoString.replace(/[^\d,]/g, '').replace(',', '.'));

    if (isNaN(precoNumerico)) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 });
    }

    const novoImovel = await prisma.imovel.create({
      data: {
        operacao: body.operacao,
        descricao: body.descricao,
        tipo: body.tipo,
        cidade: body.cidade,
        bairro: body.bairro,
        endereco: body.endereco,
        preco: precoNumerico,
        destaque: body.destaque ?? false,
        tourUrl: body.tourUrl ?? null,
        capa: body.capa ?? (Array.isArray(body.fotos) ? body.fotos[0] : null),
        fotos: {
          create: Array.isArray(body.fotos)
            ? body.fotos.map((url: string) => ({ url }))
            : [],
        },
      },
      include: { fotos: true },
    });

    console.log('Imóvel criado com sucesso:', novoImovel);
    return NextResponse.json(novoImovel, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json({ error: 'Erro ao cadastrar imóvel' }, { status: 500 });
  }
}
