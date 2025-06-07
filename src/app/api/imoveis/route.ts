import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';


export async function GET() {
  try {
    console.log('Buscando imóveis...');
    const imoveis = await prisma.imovel.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { fotos: true },
    });

    // Filtra fotos com url vazia ou null
    const imoveisFiltrados = imoveis.map(imovel => ({
      ...imovel,
      fotos: imovel.fotos.filter(foto => foto.url && foto.url.trim() !== ''),
    }));

    console.log(`Encontrados ${imoveisFiltrados.length} imóveis`);
    return NextResponse.json(imoveisFiltrados);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Recebendo dados para cadastro:', body);

    const precoNumerico = parseFloat(
      body.preco.replace(/[^\d,]/g, '').replace(',', '.')
    );

    const novoImovel = await prisma.imovel.create({
      data: {
        operacao: body.operacao,
        descricao: body.descricao,
        tipo: body.tipo,
        cidade: body.cidade,
        bairro: body.bairro,
        endereco: body.endereco,
        preco: precoNumerico,
        destaque: body.destaque,  // <-- campo destaque incluído aqui
        tourUrl: body.videoTour,
 
        fotos: {
          create: body.fotos.map((url: string) => ({ url })),
        },
      },
      include: { fotos: true },
    });

    console.log('Imóvel criado com sucesso:', novoImovel);
    return NextResponse.json(novoImovel, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar imóvel' }, { status: 500 });
  }
}
