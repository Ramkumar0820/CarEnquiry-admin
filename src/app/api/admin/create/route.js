import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload } = await verifyToken(token);

    if (payload.role !== "SUPER_ADMIN")
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    
    const data = await req.json();

    const hashed = await bcrypt.hash(data.password, 10);

    const admin = await Admin.create({
      ...data,
      password: hashed,
      role: "ADMIN",
    });

    return NextResponse.json({ success: true, admin });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
