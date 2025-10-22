import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Login com Google (opcional em dev, necessário configurar variáveis de ambiente)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Login por credenciais (email/senha) para desenvolvimento
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // ATENÇÃO: Isto é apenas para desenvolvimento.
        // Substitua por validação real (banco de dados) em produção.
        const email = credentials?.email?.trim();
        const password = credentials?.password?.trim();

        if (!email || !password) return null;

        // Exemplo simples: aceita qualquer combinação não vazia
        return {
          id: email,
          name: email.split("@")[0],
          email,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
