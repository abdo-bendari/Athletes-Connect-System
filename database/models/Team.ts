import mongoose, { Schema, Document } from "mongoose";

interface ITeam extends Document {
  name: string;
  sportType: "football" | "tennis" | "paddle";
  wins: number;
  losses : number;
  tie : number;
  totalMatches: number;
  totalPoints: number;
  players: mongoose.Types.ObjectId[];
  coach: mongoose.Types.ObjectId | null;
  captain: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    wins:{
      type: Number,
      default: 0,
    },
    losses:{
      type: Number,
      default: 0,
    },
    tie :{
      type :Number ,
      default : 0
    },
    totalMatches :{
      type : Number ,
      default : 0
    },
    totalPoints :{
      type : Number ,
      default : 0
    },
    sportType: {
      type: String,
      enum: ["football", "tennis", "paddle"],
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
