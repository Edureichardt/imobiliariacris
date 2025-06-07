import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, email, mensagem } = await request.json();

    if (!nome || !telefone || !email || !mensagem) {
      return new Response(JSON.stringify({ error: 'Preencha todos os campos.' }), { status: 400 });
    }

    // Configure seu transporte SMTP aqui (exemplo com Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'SEU_EMAIL@gmail.com',
        pass: 'SUA_SENHA_APP' // Use senha de app para Gmail
      }
    });

    const mailOptions = {
      from: email,
      to: 'EMAIL_DO_DONO_DO_SITE@dominio.com',
      subject: `Contato do site - ${nome}`,
      text: `
        Nome: ${nome}
        Telefone: ${telefone}
        Email: ${email}
        Mensagem: ${mensagem}
      `
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email enviado com sucesso!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao enviar email.' }), { status: 500 });
  }
}
