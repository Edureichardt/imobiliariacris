import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get('title')?.toString();
  const description = formData.get('description')?.toString();
  const priceStr = formData.get('price')?.toString();
  const price = priceStr ? parseFloat(priceStr) : 0;

  const file = formData.get('image') as File | null;

  if (!title || !description || !price || !file) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // Salvar arquivo no disco
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}_${file.name.replaceAll(' ', '_')}`;
  const filePath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(filePath, buffer);

  const imageUrl = `/uploads/${filename}`;

  // Criar imóvel com foto no banco
  const imovel = await prisma.imovel.create({
    data: {
      descricao: description,
      preco: price,
      // Campos obrigatórios que seu model precisa (adicione os valores reais ou default aqui)
      operacao: 'comprar',  // exemplo, ajustar conforme seu uso
      tipo: 'apartamento',  // exemplo, ajustar conforme seu uso
      cidade: 'Cidade Exemplo',  // exemplo, ajustar conforme seu uso
      bairro: 'Bairro Exemplo',  // exemplo, ajustar conforme seu uso
      endereco: 'Endereço Exemplo',  // exemplo, ajustar conforme seu uso
      destaque: false,
      ativo: true,

      fotos: {
        create: {
          url: imageUrl,
        },
      },
    },
    include: {
      fotos: true,
    },
  });

  return NextResponse.json({ success: true, imovel });
}

export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      include: { fotos: true },
      orderBy: { criadoEm: 'desc' },
    });
    return NextResponse.json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
  }
}
