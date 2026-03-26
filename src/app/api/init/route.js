import Notification from "@/models/Notification";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    // Initialize all collections by accessing them
    await Notification.collection.stats();
    await Admin.collection.stats();

    return Response.json({
      success: true,
      message: "All collections initialized",
      collections: [ "Notification", "Admin"]
    });
  } catch (error) {
    console.error("Init error:", error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
