import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error); // agora o error está sendo usado
    return NextResponse.json({ error: 'Falha ao buscar imagens' }, { status: 500 });
  }
}
