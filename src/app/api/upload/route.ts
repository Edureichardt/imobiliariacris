import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Permite usar Buffer e API node padrão

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // formData.get pode retornar File | File[] | null
    let file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Se vier array, pega o primeiro
    if (Array.isArray(file)) {
      file = file[0];
    }

    // Agora o TypeScript entende que 'file' é um File
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64 = buffer.toString('base64');
    const dataUri = `data:${(file as File).type};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'imoveis',
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}
