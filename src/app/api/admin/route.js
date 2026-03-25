import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

// List admins
export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload } = await verifyToken(token);

    if (payload.role !== "SUPER_ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const admins = await Admin.find({ role: "ADMIN" })
      .select("-password") // hide password
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, admins });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// Create admin
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload } = await verifyToken(token);

    if (payload.role !== "SUPER_ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const formData = await req.formData();

    const data = Object.fromEntries(formData.entries());

    const exists = await Admin.findOne({ email: data.email });

    if (exists)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );

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
