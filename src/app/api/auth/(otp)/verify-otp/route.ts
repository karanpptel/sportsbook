import {NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";



export async function POST(req:Request) {

    try {
        const {email, otp} = await req.json();

        if(!email || !otp) {
            return NextResponse.json({error: "Email and OTP are required"}, {status: 400});
        }

        //find user by email
        const otpRecord = await prisma.emailOtp.findFirst({
            where: {email, verified: false, expiresAt: {gt: new Date()}},
            orderBy: {createdAt: "desc"},
        });

        if(!otpRecord) {
            return NextResponse.json({error: "Invalid or expired OTP"}, {status: 400});
        }

        //verify otp code in database
        const isOtpValid = await bcrypt.compare(otp, otpRecord.tokenHash);
        if(!isOtpValid) {

            //increments attempt
            await prisma.emailOtp.update({
                where: {id: otpRecord.id},
                data: {attempts: {increment: 1}},
            });
            return NextResponse.json({error: "Invalid or expired OTP"}, {status: 400});
        }

        //mark otp as verified
        await prisma.emailOtp.update({
            where: {id: otpRecord.id},
            data: {verified: true},
        });

        //update user
        await prisma.user.update({
            where: {email},
            data: {emailVerified: true},
        });

        return NextResponse.json({message: "Email verified successfully"}, {status: 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});

    }
}
