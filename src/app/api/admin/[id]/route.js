import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";
import fs from "fs/promises";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

// Helper
async function checkSuperAdmin(req) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) return null;

  const { payload } = await verifyToken(token);

  if (payload.role !== "SUPER_ADMIN") return null;

  return payload;
}

// Get single admin
export async function GET(req, { params }) {
  try {
    await connectDB();

    // const auth = await checkSuperAdmin(req);

    // if (!auth)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const admin = await Admin.findById(id).select("-password");

    if (!admin)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, admin });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// Update admin
export async function PUT(req, { params }) {
  try {
    await connectDB();

     // const auth = await checkSuperAdmin(req);

    // if (!auth)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    // const data = await req.json(); 
    const formData = await req.formData();


    const updateData = {};

    const fields = [
      "firstName",
      "lastName",
      "email",
      "companyName",
      "gender",
      "dob",
      "phone",
      "phoneCode",
      "availability",
    ];

     for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== "") {
        updateData[field] = value;
      }
    }

    const file = formData.get("profileImg");

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(
        process.cwd(),
        "uploads/admin"
      );

      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${id}-${Date.now()}${path.extname(file.name)}`;

      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      updateData.profileImg = `/uploads/admin/${fileName}`;
    }

    //Update admin
    const updated = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      admin: updated,
    });

  } catch (err) {
    console.error("PUT Error:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}



// Delete api
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const auth = await checkSuperAdmin(req);

    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const deleted = await Admin.findByIdAndDelete(id);

    if (!deleted)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Admin Details Deleted" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
