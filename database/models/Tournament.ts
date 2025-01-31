import mongoose, { Schema, Document } from "mongoose";

interface ITournament extends Document {
  name: string;
  sportType: "football" | "tennis" | "paddle";
  stadium: mongoose.Types.ObjectId;
  teams: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  prize: number;
  status: "scheduled" | "ongoing" | "completed";
  winner: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const tournamentSchema = new Schema<ITournament>(
  {
    name: {
      type: String,
      required: true,
    },
    sportType: {
      type: String,
      enum: ["football", "tennis", "paddle"],
      required: true,
    },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  { timestamps: true }
);

const Tournament = mongoose.model<ITournament>("Tournament", tournamentSchema);

export default Tournament;
