import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../db";
import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// import GitLabProvider from "next-auth/providers/gitlab";


export const authOptions = {
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // GitLabProvider({
    //   clientId: process.env.GITLAB_CLIENT_ID,
    //   clientSecret: process.env.GITLAB_CLIENT_SECRET
    // })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);
