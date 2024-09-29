// import NextAuth from "next-auth/next";
// import { compare } from "bcrypt";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/prisma/db";

// const handler = NextAuth({
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {},
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials, req) {
//         const callbackUrl = req.body?.callbackUrl;
//         console.log(callbackUrl);
//         // console.log({ credentials, req });
//         // Fetch the user from the database using Prisma
//         // const user = await prisma.petOwner.findUnique({
//         //   where: { email: credentials?.email },
//         // });

//         let user = null;

//         if (callbackUrl.includes("/pets")) {
//           console.log("pets");
//           // Check the database type for the /pets URL
//           user = await prisma.petOwner.findUnique({
//             where: { email: credentials?.email },
//           });
//         } else {
//           // Check the database type for other URLs
//           console.log("doctor");
//           user = await prisma.doctor.findUnique({
//             where: { email: credentials?.email },
//           });
//         }

//         // If user not found, return null
//         if (!user) {
//           throw new Error("User not found");
//           return null;
//         }

//         // Compare the provided password with the stored hash
//         const passwordCorrect = await compare(
//           credentials?.password || "",
//           user.password
//         );

//         // If the password is correct, return the user object
//         if (passwordCorrect) {
//           return {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//           };
//         }

//         // If password is incorrect, return null
//         return null;
//       },
//     }),
//   ],
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth/next";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
import { AuthOptions } from "next-auth";
import { authOptions } from "./auth";

// export const authOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {},
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials, req) {
//         const callbackUrl = req.body?.callbackUrl;
//         console.log(callbackUrl);

//         let user = null;

//         if (callbackUrl.includes("/pets")) {
//           console.log("pets");
//           user = await prisma.petOwner.findUnique({
//             where: { email: credentials?.email },
//           });
//         } else {
//           console.log("doctor");
//           user = await prisma.doctor.findUnique({
//             where: { email: credentials?.email },
//           });
//         }

//         if (!user) {
//           throw new Error("User not found");
//         }

//         const passwordCorrect = await compare(
//           credentials?.password || "",
//           user.password
//         );

//         if (passwordCorrect) {
//           return {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//           };
//         }

//         return null;
//       },
//     }),
//   ],
// } as AuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
