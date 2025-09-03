// app/api/forgot-password/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";

const SALT_ROUNDS = 10;
const TOKEN_EXPRIY_MINUTES = 30;

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        }

        //find user in db by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "If that email exists in our system, a reset link has been sent." }, { status: 200 });
        }


        //generate reset token
        const token = crypto.randomBytes(32).toString("hex");

        //hash reset token and save to db
        const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);

        const expiryAt = new Date(Date.now() + TOKEN_EXPRIY_MINUTES * 60 * 1000); // 30 minutes


          // Create or update password reset token in DB
         // Clear previous tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id, used: false },
        });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: expiryAt,
                used: false,
            },
        });


        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        await sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({ message: "If that email exists in our system, a reset link has been sent." }, { status: 200 });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}