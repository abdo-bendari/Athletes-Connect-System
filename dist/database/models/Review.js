"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    stadium: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Stadium",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Ensure a user can leave only one review per movie
reviewSchema.index({ user: 1, stadium: 1 }, { unique: true });
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
