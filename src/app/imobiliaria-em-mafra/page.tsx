// app/imobiliaria-em-mafra/page.tsx

import Link from "next/link";
import Head from "next/head";

export default function ImobiliariaMafra() {
  return (
    <>
      <Head>
        <title>Imobiliária em Mafra | CA Imóveis</title>
        <meta
          name="description"
          content="Descubra imóveis à venda e para aluguel em Mafra com a CA Imóveis. Atendimento de qualidade e as melhores oportunidades na região."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Imobiliária em Mafra - SC</h1>
        <p className="text-lg mb-6">
          A <strong>CA Imóveis</strong> conecta você aos melhores imóveis de
          Mafra. Seja para comprar, vender ou alugar, temos as melhores opções
          com agilidade e atendimento de excelência.
        </p>
        <p className="mb-4">
          Como <strong>imobiliária em Mafra</strong>, estamos comprometidos em
          oferecer soluções rápidas e seguras, sempre pensando na sua
          necessidade.
        </p>
        <p className="mb-6">
          Acesse agora nosso catálogo online e fale conosco pelo WhatsApp.
        </p>
        <Link
          href="/imoveis?cidade=Mafra"
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
        >
          Ver imóveis em Mafra
        </Link>
      </main>
    </>
  );
}
