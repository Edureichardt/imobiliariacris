import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // se não estiver logado, redireciona pra /login
  },
});

export const config = {
  matcher: ["/admin/:path*"], // protege todas as rotas dentro de /admin
};
