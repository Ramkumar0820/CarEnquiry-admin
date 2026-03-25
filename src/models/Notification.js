import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: { type: String, default: "inquiry" },
  message: { type: String, required: true },
  inquiryId: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date },
  clickedAt: { type: Date },
});

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;
