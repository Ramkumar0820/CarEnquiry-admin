import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Admin from "../src/models/Admin.js";
import { connectDB } from "../src/lib/db.js";

async function seedSuperAdmin() {
  try {
    await connectDB();

    const exists = await Admin.findOne({
      role: "SUPER_ADMIN",
    });

    if (exists) {
      console.log("Super admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("123456", 10);

    await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@carsale.com",
      password: hashed,
      role: "SUPER_ADMIN",
      availability: "Active",
    });

    console.log("Super admin created successfully");
    process.exit();

  } catch (err) {
    console.error("Seeder error:", err);
    process.exit(1);
  }
}

seedSuperAdmin();
