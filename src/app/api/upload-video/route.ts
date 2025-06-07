import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum vídeo enviado' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // 👈 Importante para vídeo
          folder: 'imoveis',      // Pasta opcional no Cloudinary
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });
console.log('Upload result Cloudinary:', uploadResult); 
    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error('Erro no upload de vídeo:', error);
    return NextResponse.json({ error: 'Erro no upload de vídeo' }, { status: 500 });
  }
}
