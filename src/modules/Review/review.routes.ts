import express from 'express';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import * as R from './controller/review.controller';
const reviewRouter = express.Router();
reviewRouter
.post("/",protectedRoutes,R.createReview)

.get("/Recent", protectedRoutes, R.getRecentReviews)

.get("/:stadiumId/stadium", protectedRoutes, R.getReviewsByStadium)

.get("/:userId/user",protectedRoutes, R.getReviewsByUser)

.delete("/:id", protectedRoutes,allowedTo("owner"),R.deleteReview);

export default reviewRouter;
