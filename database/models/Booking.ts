import mongoose, { Schema, Document } from "mongoose";

interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  stadium: mongoose.Types.ObjectId;
  slot: string | Date;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    slot: {
      type: String,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
