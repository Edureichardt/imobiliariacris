// app/imobiliaria-em-rio-negro/page.tsx

import Link from "next/link";
import Head from "next/head";

export default function ImobiliariaRioNegro() {
  return (
    <>
      <Head>
        <title>Imobiliária em Rio Negro | CA Imóveis</title>
        <meta
          name="description"
          content="Encontre casas, apartamentos e terrenos à venda ou para alugar em Rio Negro com a CA Imóveis. Sua imobiliária de confiança na região."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">
          Imobiliária em Rio Negro - PR
        </h1>
        <p className="text-lg mb-6">
          A <strong>CA Imóveis</strong> é referência em Rio Negro quando o
          assunto é aluguel e compra de imóveis. Oferecemos uma grande
          variedade de casas, apartamentos, terrenos e imóveis comerciais na
          região.
        </p>
        <p className="mb-4">
          Se você está procurando por uma <strong>imobiliária em Rio Negro</strong> que
          ofereça confiança, atendimento personalizado e opções de imóveis
          atualizadas, você está no lugar certo.
        </p>
        <p className="mb-6">
          Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal.
        </p>
        <Link
          href="/imoveis?cidade=Rio%20Negro"
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
        >
          Ver imóveis em Rio Negro
        </Link>
      </main>
    </>
  );
}
