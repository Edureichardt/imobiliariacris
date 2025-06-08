import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllImoveis() {
  return prisma.imovel.findMany({
    include: { fotos: true },
  });
}

export async function getImovelById(id: string) {
  return prisma.imovel.findUnique({
    where: { id },
    include: { fotos: true },
  });
}

export async function updateImovel(id: string, data: { ativo: boolean }) {
  return prisma.imovel.update({
    where: { id },
    data,
  });
}

export async function createImovel(data: {
  tipo: string;
  cidade: string;
  bairro?: string;
  operacao: string;
  preco: number;
  destaque?: boolean;
  ativo?: boolean;
  fotos?: { url: string }[];
  tourUrl?: string | null;
}) {
  const {
    tipo,
    cidade,
    bairro,
    operacao,
    preco,
    destaque = false,
    ativo = true,
    fotos = [],
    tourUrl,
  } = data;

  return prisma.imovel.create({
    data: {
      tipo,
      cidade,
      bairro,
      operacao,
      preco,
      destaque,
      ativo,
      ...(tourUrl !== null && tourUrl !== undefined ? { tourUrl } : {}),
      fotos: {
        create: fotos.map((foto) => ({
          url: foto.url,
        })),
      },
    },
    include: { fotos: true },
  });
}
