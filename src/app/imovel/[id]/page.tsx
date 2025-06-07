import { prisma } from '@/app/lib/prisma';
import DetalheImovelCliente from './DetalheImovelCliente';

interface Props {
  params: { id: string };
}

export default async function DetalheImovel({ params }: Props) {
  const imovel = await prisma.imovel.findUnique({
    where: { id: params.id },
    include: { fotos: true },
  });

  if (!imovel) return <div className="text-center p-10">Imóvel não encontrado.</div>;

  return <DetalheImovelCliente imovel={imovel} />;
}

