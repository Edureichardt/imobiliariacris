// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH; // bcrypt hash
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { usuario, senha } = await req.json();

  if (usuario !== ADMIN_USER) {
    return NextResponse.json({ ok: false, message: "Credenciais inválidas" }, { status: 401 });
  }

  const match = await bcrypt.compare(senha, ADMIN_PW_HASH);
  if (!match) {
    return NextResponse.json({ ok: false, message: "Credenciais inválidas" }, { status: 401 });
  }

  const token = jwt.sign({ usuario, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  return res;
}
