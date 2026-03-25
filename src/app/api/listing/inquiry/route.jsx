import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStart } from "@/lib/dbConnect"; // Ensure connectionStart is correctly imported
import { sendMail } from "@/lib/sendMail";
import Notification from "@/models/Notification";

// Function to establish MongoDB connection
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

// Function to disconnect from MongoDB
const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw new Error("Failed to disconnect from MongoDB");
  }
};

// GET endpoint to fetch all inquiries
export async function GET(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;
    const mainPostCollection = db.collection("CarInquiries");

    const posts = await mainPostCollection.find({}).toArray(); // Query all documents

    // await disconnectFromDatabase(); // Disconnect from MongoDB

    return NextResponse.json(posts); // Return posts
  } catch (error) {
    console.error("Error fetching posts from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts from MongoDB" },
      { status: 500 },
    );
  }
}

// POST endpoint to add a new inquiry
export async function POST(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;

    const mainPostCollection = db.collection("CarInquiries");

    const postData = await req.json(); // Assuming POST data is JSON

    // Generate a random 6-digit number
    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);

    // Add the custom key-value pair
    postData["id"] = randomSixDigitNumber;

    const insertResult = await mainPostCollection.insertOne(postData); // Insert data

    // Create a notification for the new inquiry
    try {
      // const notificationsCollection = db.collection("Notifications");
      const notification = {
        type: "inquiry",
        message: `New inquiry from ${postData.name} for ${postData.productName}`,
        inquiryId: insertResult.insertedId.toString(),
        data: postData,
        read: false,
        createdAt: new Date(),
      };
      await Notification.create(notification);
    } catch (notifyErr) {
      console.error("Failed to create notification:", notifyErr);
    }

    return NextResponse.json({
      message: "Inquiry added successfully",
      postId: insertResult.insertedId,
      postData,
    });
  } catch (error) {
    console.error("Error adding inquiry to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to add inquiry to MongoDB" },
      { status: 500 },
    );
  }
}

// DELETE endpoint to delete a inquiry by ID
export async function DELETE(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;
    const mainPostCollection = db.collection("CarInquiries");

    const { id } = await req.json(); // Assuming DELETE data contains an ID

    // Ensure id is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    const deleteResult = await mainPostCollection.deleteOne({ _id: objectId }); // Delete data

    if (deleteResult.deletedCount === 1) {
      return NextResponse.json({ message: "Inquiry deleted successfully" });
    } else {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting inquiry from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry from MongoDB" },
      { status: 500 },
    );
  }
}

// PUT endpoint to update a post by ID
// export async function PUT(req) {
//     try {
//         await connectToDatabase(); // Connect to MongoDB

//         const db = mongoose.connection;
//         const mainPostCollection = db.collection('CarInquiries');

//         const { id, updateData } = await req.json(); // Assuming PUT data contains an ID and updateData

//         // Ensure id is a valid ObjectId string
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
//         }

//         const objectId = mongoose.Types.ObjectId.createFromHexString(id);

//         const updateResult = await mainPostCollection.updateOne(
//             { _id: objectId },
//             { $set: updateData }
//         ); // Update data

//         if (updateResult.matchedCount === 1) {
//             return NextResponse.json({ message: "Inquiry updated successfully" });
//         } else {
//             return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
//         }
//     } catch (error) {
//         console.error("Error updating inquiry in MongoDB:", error);
//         return NextResponse.json({ error: "Failed to update inquiry in MongoDB" }, { status: 500 });
//     }
// }

export async function PUT(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;
    const mainPostCollection = db.collection("CarInquiries");

    const { id } = await req.json(); // Assuming PUT data contains an ID and updateData

    // Ensure id is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const objectId = mongoose.Types.ObjectId.createFromHexString(id);
    const inquiry = await mainPostCollection.findOne({ _id: objectId });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.markAsRead === true) {
      return NextResponse.json({ message: "Already marked as read" });
    }
    await mainPostCollection.updateOne(
      { _id: objectId },
      { $set: { markAsRead: true } },
    );

    // Mark related notification as read
    try {
      // const notificationsCollection = db.collection("Notifications");
      await Notification.updateMany(
        { inquiryId: objectId.toString(), type: "inquiry" },
        { $set: { read: true, readAt: new Date() } }
      );
    } catch (notifyErr) {
      console.error("Failed to update notification read status:", notifyErr);
    }
    // await sendMail({
    //   to: inquiry.email,
    //   subject: "We received your inquiry",
    //   html: `
    //     <p>Hi ${inquiry.name},</p>
    //     <p>Thank you for contacting us regarding <b>${inquiry.productName}</b>.</p>
    //     <p>Our team has reviewed your inquiry and will get back to you shortly.</p>
    //     <br/>
    //     <p>Regards,<br/>Car Team</p>
    //   `,
    // });

    return NextResponse.json({
      message: "Inquiry marked as read successfully",
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}
