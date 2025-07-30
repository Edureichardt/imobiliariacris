import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://caimoveis.dev.br';

  // Busca os imóveis da API
  const imoveis = await fetch(`${baseUrl}/api/imoveis`)
    .then(res => res.json());

  const today = new Date().toISOString();

  // URLs estáticas
  const staticUrls = [
    '/',
    '/sobre',
    '/imoveis',
    '/imobiliaria-em-rio-negro',
    '/imobiliaria-em-mafra'
  ]
    .map(path => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <priority>${path === '/' ? '1.0' : '0.8'}</priority>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
    </url>
  `)
    .join('');

  // URLs dinâmicas de imóveis
  const urlsImoveis = imoveis.map((i: any) => `
    <url>
      <loc>${baseUrl}/imovel/${i.slug}</loc>
      <priority>0.8</priority>
      <lastmod>${i.updatedAt || today}</lastmod>
      <changefreq>weekly</changefreq>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${urlsImoveis}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  });
}
