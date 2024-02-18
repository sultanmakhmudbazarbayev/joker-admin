import axios from "@/application/actions/axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { login, password } = credentials;
          const { data } = await axios.post("/login", { login, password });

          return data;
        } catch (e) {
          throw new Error(e);
        }
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 59,
  },
  pages: {
    signIn: "/login",
    error: "/404",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }

      return token;
    },
    async session({ session, token }) {
      session.token = token.token;
      session.user = token.user;

      return session;
    },
  },
};

export default NextAuth(authOptions);
