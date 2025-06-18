// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://caimoveis.dev.br';

  // Busca todos os imóveis via sua API
  const imoveis = await fetch(`${baseUrl}/api/imoveis`)
    .then(res => res.json());

  // URLs estáticas
  const staticUrls = [
    `${baseUrl}/`,
    `${baseUrl}/sobre`,
    `${baseUrl}/imoveis`,
  ].map(url => `
    <url>
      <loc>${url}</loc>
      <priority>${ url === baseUrl + '/' ? '1.0' : '0.8' }</priority>
    </url>
  `).join('');

  // Gera uma <url> por imóvel
  const urlsImoveis = imoveis.map((i: any) => `
    <url>
      <loc>${baseUrl}/imovel/${i.id}</loc>
      <priority>0.8</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${urlsImoveis}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
