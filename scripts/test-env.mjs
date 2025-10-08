// scripts/test-env.mjs
import dotenv from 'dotenv';
import path from 'path';

// força carregar o .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log("ADMIN_USER:", process.env.ADMIN_USER);
console.log("ADMIN_PW_HASH:", process.env.ADMIN_PW_HASH);
