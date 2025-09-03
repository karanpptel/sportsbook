// app/api/reset-password/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 10;

export async function POST(req: Request) {
    try {
        const { token, email, newPassword } = await req.json();

         if (
            !token ||
            typeof token !== "string" ||
            !email ||
            typeof email !== "string" ||
            !newPassword ||
            typeof newPassword !== "string"
        ) {
            return NextResponse.json({ message: "Invalid input" }, { status: 400 });
        }


        //find user in db by email
        const user = await prisma.user.findUnique({ where: { email } });
        // For security don't reveal user absence explicitly
        if (!user) {
            return NextResponse.json({ message: "Invalid token or email" }, { status: 404 });
        }


         // Find reset token record which is not used and not expired
        const resetTokenRecord = await prisma.passwordResetToken.findFirst({
            where: {
                userId: user.id,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if(!resetTokenRecord) {
            return NextResponse.json({ message: "Invalid token or email" }, { status: 404 });
        }


        // Verify reset token
        const isTokenValid = await bcrypt.compare(token, resetTokenRecord.tokenHash);
        if (!isTokenValid) {
            return NextResponse.json({ message: "Invalid token or email" }, { status: 404 });
        }

        // Hash new password securly
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

         // Update user password and mark token as used in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetTokenRecord.id },
                data: { used: true },
            }),
        ]);

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ message: "Error resetting password" }, { status: 500 });
    }
}
        