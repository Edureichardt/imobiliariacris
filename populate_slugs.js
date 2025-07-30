import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function generateSlug(description, city, id) {
  const baseSlug = `${description ?? ''} ${city ?? ''} ${id}`;
  return slugify(baseSlug, { lower: true, strict: true });
}

async function main() {
  // Busca imóveis sem slug ou com slug vazio
  const imoveisSemSlug = await prisma.imovel.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: '' },
      ],
    },
  });

  console.log(`Encontrados ${imoveisSemSlug.length} imóveis sem slug.`);

  for (const imovel of imoveisSemSlug) {
    const slug = await generateSlug(imovel.description, imovel.city, imovel.id);

    await prisma.imovel.update({
      where: { id: imovel.id },
      data: { slug },
    });

    console.log(`Imóvel ${imovel.id} atualizado com slug: ${slug}`);
  }

  console.log('Atualização dos slugs concluída.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
