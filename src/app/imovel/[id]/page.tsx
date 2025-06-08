import { prisma } from '@/app/lib/prisma';
import DetalheImovelCliente from './DetalheImovelCliente';
import { Metadata } from 'next';

interface DetalheImovelProps {
  params: {
    id: string;
  };
}

// SEO opcional
export const generateMetadata = async ({ params }: DetalheImovelProps): Promise<Metadata> => {
  const imovel = await prisma.imovel.findUnique({
    where: { id: params.id },
  });

  return {
    title: imovel?.titulo || 'Imóvel',
    description: imovel?.descricao?.substring(0, 150) || '',
  };
};

export default async function DetalheImovel({ params }: DetalheImovelProps) {
  const imovel = await prisma.imovel.findUnique({
    where: { id: params.id },
    include: { fotos: true },
  });

  if (!imovel) {
    return <div className="text-center p-10">Imóvel não encontrado.</div>;
  }

  return <DetalheImovelCliente imovel={imovel} />;
}
