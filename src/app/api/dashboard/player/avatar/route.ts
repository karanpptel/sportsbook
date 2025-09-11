import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file -> Buffer -> Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadRes = await cloudinary.uploader.upload_stream(
      { folder: "sportsbook/avatars" },
      (error, result) => {
        if (error || !result) throw error;
        return result;
      }
    );

    // Promise wrapper to use upload_stream with buffer
    const result: any = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "sportsbook/avatars" },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      upload.end(buffer);
    });

    // Update in DB
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { avatarUrl: result.secure_url },
    });

    return NextResponse.json({ success: true, avatarUrl: result.secure_url });
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
