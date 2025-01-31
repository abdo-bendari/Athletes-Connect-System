import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export function dbConnection() {
  connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch(() => {
      console.log("database connected failed");
    });
}
