import mongoose, { Schema, Document } from "mongoose";
import User from "./User";

interface IStadium extends Document {
  name: string;
  address: string;
  sportType: "football" | "tennis" | "paddle";
  capacity: number;
  pricePerHour: number;
  owner: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  reviews: mongoose.Types.ObjectId[];
  availableSlots: string[];
  isAvailable: boolean;
  facilities: string[];
  imageUrl: string;
  isIndoor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stadiumSchema = new Schema<IStadium>(
  {
    name: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
    sportType: {
      type: String,
      enum: ["football", "tennis", "paddle"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    availableSlots: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
    },
    isIndoor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

stadiumSchema.index({ location: "2dsphere" });

const Stadium = mongoose.model<IStadium>("Stadium", stadiumSchema);

export default Stadium;
