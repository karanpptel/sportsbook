// src/app/api/upload/route.ts
import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

interface UploadResult {
  secure_url: string;
}

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const uploadRes = await new Promise<UploadResult>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { 
                folder: "sportsbook/venues",
                transformation: [
                  { width: 800, height: 600, crop: "fill" },
                  { quality: "auto", fetch_format: "auto" }
                ],
                resource_type: "auto",
                allowed_formats: ["jpg", "png", "jpeg"],
                format: "jpg"
              }, 
              (err, result) => {
                if (err) reject(err);
                else if (result) resolve(result);
                else reject(new Error("Upload result is undefined"));
              }
            )
            .end(buffer);
        });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
