import prisma from "@/prisma/db";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

interface User {
  id: string;
  email: string;
  role: string;
  password: string;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {},
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const callbackUrl = req.body?.callbackUrl;
        console.log(callbackUrl);

        let user: User | null = null;

        switch (true) {
          case callbackUrl.includes("/pets"):
            user = (await prisma.petOwner.findUnique({
              where: { email: credentials?.email },
            })) as User | null;
            break;
          default:
            user = (await prisma.doctor.findUnique({
              where: { email: credentials?.email },
            })) as User | null;
        }

        // if (callbackUrl.includes("/pets")) {
        //   console.log("pets");
        //   user = await prisma.petOwner.findUnique({
        //     where: { email: credentials?.email },
        //   });
        // } else {
        //   console.log("doctor");
        //   user = await prisma.doctor.findUnique({
        //     where: { email: credentials?.email },
        //   });
        // }

        if (!user) {
          throw new Error("User not found");
        }

        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
} as AuthOptions;
