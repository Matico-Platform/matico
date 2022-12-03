import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../db";
import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
// import GitLabProvider from "next-auth/providers/gitlab";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
    }),
    // GitLabProvider({
    //   clientId: process.env.GITLAB_CLIENT_ID,
    //   clientSecret: process.env.GITLAB_CLIENT_SECRET
    // })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
