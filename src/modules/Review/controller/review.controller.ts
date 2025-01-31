import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../utils/Error";
import catchError from "../../../middleware/catchError";
import Review from "../../../../database/models/Review";

export const createReview = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { stadium, user, rating, comment } = req.body;

  if (!stadium || !user || !rating) {
    return next(new AppError("stadium, user, and rating are required", 400));
  }

  const existingReview = await Review.findOne({ stadium, user });
  if (existingReview) {
    return next(new AppError("You have already reviewed this stadium", 400));
  }

  const review = new Review({
    stadium,
    user,
    rating,
    comment,
  });

  await review.save();
  res.status(201).json({ message: "Review created successfully", review });
});

export const getReviewsByStadium = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { stadiumId } = req.params;
  
    if (!stadiumId) {
      return next(new AppError("stadium ID is required", 400));
    }
  
    const reviews = await Review.find({ stadium: stadiumId }).populate("user", "name email");
    if (reviews.length === 0) {
      return next(new AppError("No reviews found for this stadium", 404));
    }
  
    res.status(200).json({ message: "Success", totalCount: reviews.length, reviews });
  });

  export const getReviewsByUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
  
    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }
  
    const reviews = await Review.find({ user: userId }).populate("stadium", "name");
    if (reviews.length === 0) {
      return next(new AppError("No reviews found for this user", 404));
    }
  
    res.status(200).json({ message: "Success", totalCount: reviews.length, reviews });
  });

  export const deleteReview = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    if (!id) {
      return next(new AppError("Review ID is required", 400));
    }
  
    const review = await Review.findByIdAndDelete(id);
  
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
  
    res.status(200).json({ message: "Review deleted successfully" });
  });

  
  export const getRecentReviews = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 5;
  
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("stadium", "name")
      .populate("user", "name");
  
    if (reviews.length === 0) {
      return next(new AppError("No recent reviews found", 404));
    }
  
    res.status(200).json({ message: "Success", reviews });
  });
  