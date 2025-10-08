import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();

    // Validar se usuario e senha foram fornecidos e são strings
    if (!usuario || typeof usuario !== "string") {
      return NextResponse.json(
        { ok: false, message: "Usuário é obrigatório" },
        { status: 400 }
      );
    }

    if (!senha || typeof senha !== "string") {
      return NextResponse.json(
        { ok: false, message: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    // Validar se as variáveis de ambiente estão definidas
    if (!ADMIN_USER || !ADMIN_PW_HASH || !JWT_SECRET) {
      return NextResponse.json(
        { ok: false, message: "Erro de configuração do servidor" },
        { status: 500 }
      );
    }

    // Verificar se o usuário corresponde
    if (usuario !== ADMIN_USER) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Comparar a senha fornecida com o hash
    const match = await bcrypt.compare(senha, ADMIN_PW_HASH);
    if (!match) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gerar o token JWT
    const token = jwt.sign({ usuario, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Configurar a resposta com o cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hora em segundos
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}