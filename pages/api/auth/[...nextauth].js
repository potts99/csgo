import NextAuth from "next-auth";
import Providers from "next-auth/providers/credentials";

import { connectToDatabase } from "../../../lib/mongo";
import { verifyPassword } from "../../../lib/helpers";

const options = {
  site: "http://localhost:3000/",
  providers: [
    Providers({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req, res) {
        try {
          const { db } = await connectToDatabase();
          const user = await db.collection("users").findOne({
            email: credentials.email,
          });

          if (!user) throw new Error("No user found");

          const isPasswordValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) throw new Error("Password is not valid");

          return {
            email: user.email,
            id: user._id,
          };
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  database: process.env.DATABASE_URL,
  callbacks: {
    redirect: async (url, _) => {
      if (url === "/auth/login") {
        return Promise.resolve("/");
      }
      return Promise.resolve("/");
    },
    pages: {
      signIn: "/auth/login",
      newUser: "/auth/signup",
    },
    debug: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
