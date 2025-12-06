import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub
  ],
  pages: {
    signIn: '/auth/signin', // Página custom opcional, usaremos la default por ahora o redirección
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
      
      // Permitir checkout solo si está logueado (opcional, podemos permitir guest)
      // if (isOnCheckout) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect to login
      // }
      return true;
    },
  },
});
