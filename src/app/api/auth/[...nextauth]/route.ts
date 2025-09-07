import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/validations/auth"; 
import { getToken } from "next-auth/jwt";

// Check required env variables
["NEXTAUTH_URL", "NEXTAUTH_SECRET"].forEach(name => {
  if (!process.env[name]) console.warn(`Warning: ${name} not set`);
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
   
    // Credentials (email/password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
          
         if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password in credentials.");
          return null;
        }

         //Validate credentials using Zod schema
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          console.error("Invalid credentials format:", parsed.error.issues);
          return null;
        }

        const { email, password } = parsed.data;

        //find user in db
        const user = await prisma.user.findUnique({
          where: {
            email
          },
        });

         // Type safety: check user and password
          if (!user || typeof user.passwordHash !== "string") {
            console.error("User not found or password missing.");
            return null;
          }

          //check email is verified
          if (!user.emailVerified) {
            console.error("Email not verified for user:", user.email);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            console.error("Invalid password for user:", user.email);
            return null;
          }

          return {
            id: user.id.toString(),
            name : user.fullName,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            image: user.avatarUrl,
          };  
      }

    })

  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;    // Add role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;   // Add role to session
      }
      return session;
    },

    async redirect({ baseUrl, url }) {
      // Role-based redirects
      const token = await getToken({ req: url as any, secret: process.env.NEXTAUTH_SECRET });

      if (token?.role === "USER") return `${baseUrl}/player`;
      if (token?.role === "OWNER") return `${baseUrl}/owner`;
      if (token?.role === "ADMIN") return `${baseUrl}/admin`;

      return baseUrl;
    },
    
    
  },

  pages: {
    signIn: "/login",
    error: "/login",
  
  },


  secret: process.env.NEXTAUTH_SECRET,


//   events: {
//     async createUser({ user }) {
//       console.log("🔥 createUser event fired with:", user);
//       try {
//          // Convert id to number (Prisma expects Int)
//         const userId = parseInt(user.id, 10);

//         // If the user is an OWNER, create facilityOwner record
//         if (user.role === "OWNER") {
//           await prisma.facilityOwner.create({
//             data: {
//               userId, // links facilityOwner → User
//               // add default values if your schema requires more fields
//             },
//           });
//           console.log("✅ FacilityOwner created for user:", userId);
//         }

//         // (Later you could do similar for "PLAYER" if you need a profile table)
//       } catch (error) {
//         console.error("Error creating facilityOwner:", error); 
        
//       }
//     }
//   }
};

     
 

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
