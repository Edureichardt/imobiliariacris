import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { senha } = await request.json(); // Supondo que senha venha do corpo da requisição

    // Verifica se senha foi fornecida e é uma string
    if (!senha || typeof senha !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Senha é obrigatória' },
        { status: 400 }
      );
    }

    // Compara a senha fornecida com a senha hasheada
    const match = await bcrypt.compare(senha, process.env.ADMIN_PW_HASH!);

    if (!match) {
      return NextResponse.json(
        { ok: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Prossegue com a lógica de login bem-sucedido
    return NextResponse.json({ ok: true, message: 'Login bem-sucedido' });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}