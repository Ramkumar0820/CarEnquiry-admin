import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStart } from "@/lib/dbConnect"; // Ensure connectionStart is correctly imported
import fs from "fs";
import path from "path";

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

// GET endpoint to fetch all posts
export async function GET(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;
    const mainPostCollection = db.collection("CrasListing");

    const posts = await mainPostCollection.find({}).toArray(); // Query all documents
    // const posts = await CrasListing.find({});

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

// POST endpoint to add a new post
export async function POST(req) {
  try {
    await connectToDatabase();
    const db = mongoose.connection;
    const mainPostCollection = db.collection("CrasListing");
    const formData = await req.formData();
    const imageFile = formData.get("image");
    let imagePath = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      imagePath = `/api/uploads/${fileName}`;
    }
    const postData = {};
    for (const [key, value] of formData.entries()) {
      try {
        postData[key] = JSON.parse(value);
      } catch {
        postData[key] = value;
      }
    }
    postData.image = imagePath;
    postData.id = Math.floor(100000 + Math.random() * 900000);
    const insertResult = await mainPostCollection.insertOne(postData);
    return NextResponse.json({
      message: "Post added successfully",
      postId: insertResult.insertedId,
    });
  } catch (error) {
    console.error("Error adding post:", error);
    return NextResponse.json({ error: "Failed to add post" }, { status: 500 });
  }
}

// DELETE endpoint to delete a post by ID
export async function DELETE(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const db = mongoose.connection;
    const mainPostCollection = db.collection("CrasListing");

    const { id } = await req.json(); // Assuming DELETE data contains an ID

    // Ensure id is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    const deleteResult = await mainPostCollection.deleteOne({ _id: objectId }); // Delete data

    if (deleteResult.deletedCount === 1) {
      return NextResponse.json({ message: "Post deleted successfully" });
    } else {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting post from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to delete post from MongoDB" },
      { status: 500 },
    );
  }
}

// PUT endpoint to update a post by ID
export async function PUT(req) {
  try {
    await connectToDatabase();
    const db = mongoose.connection;
    const mainPostCollection = db.collection("CrasListing");
    const formData = await req.formData();
    const id = formData.get("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const objectId = new mongoose.Types.ObjectId(id);
    const existingPost = await mainPostCollection.findOne({ _id: objectId });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    let imagePath = existingPost.image || "";
    const imageFile = formData.get("image");
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/api/uploads/${fileName}`;
    }
    const updateData = {};
    let newStockStatus = existingPost.availability;
    for (const [key, value] of formData.entries()) {
      if (["image", "id", "_id"].includes(key)) continue;
      try {
        updateData[key] = JSON.parse(value);
      } catch {
        updateData[key] = value;
      }

      if (key === "availability") {
        newStockStatus = updateData[key];
      }
    }
    updateData.image = imagePath;
     if (
      newStockStatus === "OutOfStock" &&
      existingPost.stockStatus !== "OutOfStock"
    ) {
      updateData.soldAt = new Date();
    }
    if (newStockStatus === "InStock") {
      updateData.soldAt = null;
    }
    await mainPostCollection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

