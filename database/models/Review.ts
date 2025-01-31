import mongoose, { Schema, Document } from "mongoose";


export interface IReview extends Document {
  stadium: mongoose.Types.ObjectId; 
  user: mongoose.Types.ObjectId; 
  rating: number;            
  comment?: string;       
  createdAt?: Date;         
  updatedAt?: Date;            
}


const reviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Ensure a user can leave only one review per movie
reviewSchema.index({ user: 1, stadium: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
