import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "athlete" | "admin" | "coach" | "owner";
  phoneNumber: string;
  profilePic: string;
  location: {
    latitude: number;
    longitude: number;
  };
  preferences: {
    sports: string[];
  };
  status: "active" | "banned";
  teams: mongoose.Types.ObjectId[];
  bookings: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["athlete", "admin", "coach", "owner"],
      default: "athlete",
    },
    phoneNumber: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    preferences: {
      sports: {
        type: [String],
        default: [],
      },
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    teams: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Team",
      },
    ],
    bookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],
    profilePic: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (this: any) {
  this.password = bcrypt.hashSync(this.password, 8);
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
