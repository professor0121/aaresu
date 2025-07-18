import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error', 'message', 'custom'],
      default: 'info',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    link: {
      type: String, // optional URL (e.g., to redirect user)
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object, // additional data (e.g., orderId, chatId, etc.)
      default: {},
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
