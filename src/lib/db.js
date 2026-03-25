import mongoose from "mongoose";
import { connectionStart } from "./dbConnect.js"

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(connectionStart);
}
