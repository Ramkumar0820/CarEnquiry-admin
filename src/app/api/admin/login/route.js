import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import { signToken } from "../../../../lib/jwt";
import Admin from "../../../../models/Admin";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );

    const token = await signToken({
      id: admin._id,
      role: admin.role,
      email: admin.email,
    });

    const adminData = admin.toObject();
    delete adminData.password;

    const res = NextResponse.json({
      success: true,
      role: admin.role,
      admin: adminData,
      token,
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
