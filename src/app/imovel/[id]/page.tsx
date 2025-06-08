import { prisma } from '@/app/lib/prisma';
import DetalheImovelCliente from './DetalheImovelCliente';

interface Params {
  id: string;
}

interface Props {
  params: Params | Promise<Params>; // permitir que params seja Promise também
}

export default async function DetalheImovel({ params }: Props) {
  // se params for Promise, aguarde
  const resolvedParams = await params;

  const imovel = await prisma.imovel.findUnique({
    where: { id: resolvedParams.id },
    include: { fotos: true },
  });

  if (!imovel) return <div className="text-center p-10">Imóvel não encontrado.</div>;

  return <DetalheImovelCliente imovel={imovel} />;
}
