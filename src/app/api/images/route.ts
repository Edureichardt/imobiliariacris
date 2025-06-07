import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar imagens' }, { status: 500 });
  }
}
