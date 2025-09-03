import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/validations/auth";
import { sendOTPEMail } from "@/lib/mailer";


export async function POST(req:Request) {

   try {
     const body  = await req.json();
     body.name = body.name?.trim();
    body.email = body.email?.trim();
    body.role = body.role?.toUpperCase(); // normalize
 
     const parsed = signUpSchema.safeParse(body);
     if (!parsed.success) {
       return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
     }
 
     const { name, email, password, role } = parsed.data;

    // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
    
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }
    
     const hashedPassword = await bcrypt.hash(password, 10);
 
      await prisma.user.create({
       data: {
         fullName: name,
         email,
         passwordHash: hashedPassword,
         role,
         emailVerified: false,
         
       },
     });

     // Generate OTP
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     const otpHash = await bcrypt.hash(otp, 10);
     const expiryat = new Date(Date.now() + 10 * 60 * 1000); // 15 minutes validity

     //send otp to DB
    //  await prisma.emailOtp.create({
    //    data: {
    //     email,
    //     tokenHash: otpHash,
    //     expiresAt: expiryAt,
    //    },
    //  });

    await prisma.emailOtp.upsert({
        where: { email },
      update: {
        tokenHash: otpHash,
        expiresAt: expiryat, // reset expiry
        attempts: 0,
        verified: false,
      },
      create: {
        email,
        tokenHash: otpHash,
        expiresAt: expiryat,
        attempts: 0,
        verified: false,
      },
    });


    //send otp to user
      await sendOTPEMail(email, otp);
 
     return NextResponse.json({ message: "User created. OTP sent to email." }, { status: 200 });

   } catch (error) {
     console.error("Error creating user:", error);
     return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    
   }

}