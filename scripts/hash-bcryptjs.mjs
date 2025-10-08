import bcrypt from 'bcryptjs';

const senha = 'crisimobiliaria'; // sua senha real
const hash = bcrypt.hashSync(senha, 10); // gera o hash

console.log('Hash gerado:', hash);