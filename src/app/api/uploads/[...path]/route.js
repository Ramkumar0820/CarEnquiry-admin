import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const filePath = params.path.join("/");

    const fullPath = path.join(
      process.cwd(),
      "uploads",
      filePath
    );

    if (!fs.existsSync(fullPath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);

    const ext = path.extname(fullPath).toLowerCase();

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    const contentType =
      mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });

  } catch (error) {
    console.error("Image Serve Error:", error);

    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}
