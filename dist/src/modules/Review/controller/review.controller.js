"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentReviews = exports.deleteReview = exports.getReviewsByUser = exports.getReviewsByStadium = exports.createReview = void 0;
const Error_1 = require("../../../utils/Error");
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Review_1 = __importDefault(require("../../../../database/models/Review"));
exports.createReview = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { stadium, user, rating, comment } = req.body;
    if (!stadium || !user || !rating) {
        return next(new Error_1.AppError("stadium, user, and rating are required", 400));
    }
    const existingReview = yield Review_1.default.findOne({ stadium, user });
    if (existingReview) {
        return next(new Error_1.AppError("You have already reviewed this stadium", 400));
    }
    const review = new Review_1.default({
        stadium,
        user,
        rating,
        comment,
    });
    yield review.save();
    res.status(201).json({ message: "Review created successfully", review });
}));
exports.getReviewsByStadium = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { stadiumId } = req.params;
    if (!stadiumId) {
        return next(new Error_1.AppError("stadium ID is required", 400));
    }
    const reviews = yield Review_1.default.find({ stadium: stadiumId }).populate("user", "name email");
    if (reviews.length === 0) {
        return next(new Error_1.AppError("No reviews found for this stadium", 404));
    }
    res.status(200).json({ message: "Success", totalCount: reviews.length, reviews });
}));
exports.getReviewsByUser = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return next(new Error_1.AppError("User ID is required", 400));
    }
    const reviews = yield Review_1.default.find({ user: userId }).populate("stadium", "name");
    if (reviews.length === 0) {
        return next(new Error_1.AppError("No reviews found for this user", 404));
    }
    res.status(200).json({ message: "Success", totalCount: reviews.length, reviews });
}));
exports.deleteReview = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Review ID is required", 400));
    }
    const review = yield Review_1.default.findByIdAndDelete(id);
    if (!review) {
        return next(new Error_1.AppError("Review not found", 404));
    }
    res.status(200).json({ message: "Review deleted successfully" });
}));
exports.getRecentReviews = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 5;
    const reviews = yield Review_1.default.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("stadium", "name")
        .populate("user", "name");
    if (reviews.length === 0) {
        return next(new Error_1.AppError("No recent reviews found", 404));
    }
    res.status(200).json({ message: "Success", reviews });
}));
