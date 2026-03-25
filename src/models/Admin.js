import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  profileImg: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  gender: String,
  dob: Date,
  phone: String,
  phoneCode: String,
  availability: String,
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "ADMIN"],
    default: "ADMIN",
  },
}, { timestamps: true });

export default mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema);
