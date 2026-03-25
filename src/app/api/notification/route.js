import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStart } from "@/lib/dbConnect";
import Notification from "@/models/Notification";

// Connect helper
const connectToDatabase = async () => {
  try {
    if (mongoose.connections[0].readyState !== 1) {
      await mongoose.connect(connectionStart);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export async function GET(req) {
  try {
    await connectToDatabase();
    // Use Mongoose model — returns empty array if no documents

    // with models
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).lean();

    // without models
    // const db = mongoose.connection;
    // const mainPostCollection = db.collection("notifications");

    // const notifications = await mainPostCollection.find({}).sort({ createdAt: -1 }).toArray();

    // return NextResponse.json(notifications);
    return NextResponse.json({
      status: true,
      message: "Success",
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, id } = body;

    if (action === "clearAll") {
      await Notification.deleteMany({});
      return NextResponse.json({ message: "All notifications cleared" });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    if (action === "markRead") {
      await Notification.findByIdAndUpdate(id, { read: true, readAt: new Date() });
      return NextResponse.json({ message: "Notification marked read" });
    }

    if (action === "markUnread") {
      await Notification.findByIdAndUpdate(id, { read: false, readAt: null });
      return NextResponse.json({ message: "Notification marked unread" });
    }

    if (action === "click") {
      await Notification.findByIdAndUpdate(id, { read: true, clickedAt: new Date() });
      const notif = await Notification.findById(id).lean();
      return NextResponse.json({ message: "Notification clicked", notification: notif });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
