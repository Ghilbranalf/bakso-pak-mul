import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file));
    return NextResponse.json({ images: imageFiles.map(f => `/images/${f}`) });
  } catch (error: any) {
    console.error("Error reading images dir:", error);
    return NextResponse.json({ images: [] });
  }
}
