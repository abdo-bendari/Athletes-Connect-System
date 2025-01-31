import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  name: string; 
  description: string;
  tournament: mongoose.Types.ObjectId; 
  sportType: "football" | "tennis" | "paddle"; 
  teams: mongoose.Types.ObjectId[]; 
  stadiums: mongoose.Types.ObjectId[]; 
  groups: {          
    groupName: string;     
    teams: mongoose.Types.ObjectId[];    
  }[];
  rounds: {
    roundName: "group" | "quarterfinal" | "semifinal" | "final";   
    matches: {
      team1: mongoose.Types.ObjectId;  
      team2: mongoose.Types.ObjectId;    
      stadium: mongoose.Types.ObjectId;     
      matchDate: Date; 
      result: {
        team1Score: number; 
        team2Score: number; 
      } | null; 
    }[];
  }[];
  prize: number; 
  status: "upcoming" | "ongoing" | "completed"; 
  winner: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      default: null,
    },
    sportType: {
      type: String,
      enum: ["football", "tennis", "paddle"],
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    stadiums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stadium",
      },
    ],
    groups: [
      {
        groupName: { type: String, required: true },
        teams: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
          },
        ],
      },
    ],
    rounds: [
      {
        roundName: {
          type: String,
          enum: ["group", "quarterfinal", "semifinal", "final"],
          required: true,
        },
        matches: [
          {
            team1: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Team",
              required: true,
            },
            team2: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Team",
              required: true,
            },
            stadium: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Stadium",
              required: true,
            },
            matchDate: {
              type: Date,
              required: true,
            },
            result: {
              team1Score: { type: Number, default: 0 },
              team2Score: { type: Number, default: 0 },
            },
          },
        ],
      },
    ],
    prize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
