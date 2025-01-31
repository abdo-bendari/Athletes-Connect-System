import { Schema, model, Document } from "mongoose";

interface IMatch extends Document {
  teamA: string;
  teamB: string;
  date: Date;
  location: string;
  scoreA: number;
  scoreB: number;
  status: "scheduled" | "completed" | "canceled";
  referee: string;
}

const matchSchema = new Schema<IMatch>({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["scheduled", "completed", "canceled"],
    default: "scheduled",
  },
  referee: { type: String, required: true },
});

const Match = model<IMatch>("Match", matchSchema);

export default Match;
