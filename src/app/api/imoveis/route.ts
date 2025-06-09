import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    console.log('Buscando imóveis...');
    const imoveis = await prisma.imovel.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { fotos: true },
    });

    // Converte fotos para array de URLs (strings)
    const imoveisFiltrados = imoveis.map(imovel => ({
      ...imovel,
      fotos: Array.isArray(imovel.fotos)
        ? imovel.fotos
            .filter(foto => foto.url && foto.url.trim() !== '')
            .map(foto => foto.url)
        : [],
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

    // Garante que preco seja string antes de aplicar replace
    const precoString = typeof body.preco === 'string' ? body.preco : String(body.preco ?? '');
    const precoNumerico = parseFloat(precoString.replace(/[^\d,]/g, '').replace(',', '.'));

    // Validação simples precoNumerico
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
        destaque: body.destaque ?? false,  // default false se undefined
        tourUrl: body.videoTour ?? null,

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
