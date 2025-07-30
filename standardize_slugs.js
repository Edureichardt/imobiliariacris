import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

function generateSlug(descricao, cidade, id) {
  const base = `${descricao ?? ''} ${cidade ?? ''} ${id}`;
  return slugify(base, { lower: true, strict: true });
}

async function main() {
  const imoveis = await prisma.imovel.findMany({
    select: {
      id: true,
      descricao: true,
      cidade: true,
      slug: true,
    },
  });

  for (const imovel of imoveis) {
    const slugEsperado = generateSlug(imovel.descricao, imovel.cidade, imovel.id);

    if (imovel.slug !== slugEsperado) {
      await prisma.imovel.update({
        where: { id: imovel.id },
        data: { slug: slugEsperado },
      });
      console.log(`Atualizado slug do imóvel ${imovel.id}: ${slugEsperado}`);
    }
  }

  console.log('Padronização dos slugs concluída.');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
