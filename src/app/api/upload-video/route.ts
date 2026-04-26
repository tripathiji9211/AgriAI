import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make sure public directory exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save to public directory forever
    const filepath = path.join(publicDir, "3d-animation.mp4");
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, videoUrl: `/3d-animation.mp4?t=${Date.now()}` });
  } catch (e: unknown) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
