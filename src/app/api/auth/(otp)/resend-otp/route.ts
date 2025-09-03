import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPEMail } from "@/lib/mailer";

// Generates random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Expiry: 10 minutes from now
// function getExpiryDate() {
//   const now = new Date();
//   now.setMinutes(now.getMinutes() + 10);
//   return now;
// }

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

     if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate OTP and hash
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

   // Upsert OTP record
    await prisma.emailOtp.upsert({
      where: { email },
      update: {
        tokenHash: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        attempts: 0,
        verified: false,
      },
      create: {
        email,
        tokenHash: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
        verified: false,
      },
    });

    await sendOTPEMail(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
