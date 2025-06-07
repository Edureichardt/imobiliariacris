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

  // Criar imóvel com imagem no banco
  const property = await prisma.property.create({
    data: {
      title,
      description,
      price,
      image: {
        create: {
          url: imageUrl,
        },
      },
    },
    include: {
      image: true,
    },
  });

  return NextResponse.json({ success: true, property });
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { image: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
  }
}
