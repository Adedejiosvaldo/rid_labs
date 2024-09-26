import NextAuth from "next-auth/next";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";

const handler = NextAuth({
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
        // Fetch the user from the database using Prisma
        console.log({ credentials });
        const user = await prisma.petOwner.findUnique({
          where: { email: credentials?.email },
        });

        // If user not found, return null
        if (!user) {
          return null;
        }

        // Compare the provided password with the stored hash
        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password
        );

        console.log({ passwordCorrect });

        // If the password is correct, return the user object
        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        // If password is incorrect, return null
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
