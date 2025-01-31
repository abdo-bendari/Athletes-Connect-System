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
exports.filterBookingsByStatus = exports.filterBookingsByPaymentStatus = exports.checkBookingAvailability = exports.cancelBooking = exports.getUserBookings = exports.getAllBookings = exports.updatePaymentStatus = exports.updateBookingStatus = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../../../../database/models/Booking"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
exports.createBooking = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, stadium, slot, status, paymentStatus } = req.body;
    const booking = yield Booking_1.default.create({
        user,
        stadium,
        slot,
        status: status || "pending",
        paymentStatus: paymentStatus || "unpaid",
    });
    res.status(201).json({ message: "Booking created successfully", booking });
}));
exports.updateBookingStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return next(new Error_1.AppError("Invalid status value", 400));
    }
    const booking = yield Booking_1.default.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
        return next(new Error_1.AppError("Booking not found", 404));
    }
    res.status(200).json({ message: "Booking status updated successfully", booking });
}));
exports.updatePaymentStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    if (!["paid", "unpaid"].includes(paymentStatus)) {
        return next(new Error_1.AppError("Invalid payment status value", 400));
    }
    const booking = yield Booking_1.default.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!booking) {
        return next(new Error_1.AppError("Booking not found", 404));
    }
    res.status(200).json({ message: "Payment status updated successfully", booking });
}));
exports.getAllBookings = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield Booking_1.default.find().populate("user stadium");
    res.status(200).json({ message: "All bookings fetched successfully", bookings });
}));
exports.getUserBookings = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const bookings = yield Booking_1.default.find({ user: userId }).populate("stadium");
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
}));
exports.cancelBooking = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield Booking_1.default.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
    if (!booking) {
        return next(new Error_1.AppError("Booking not found", 404));
    }
    res.status(200).json({ message: "Booking cancelled successfully", booking });
}));
exports.checkBookingAvailability = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { stadiumId, slot } = req.query;
    const existingBooking = yield Booking_1.default.findOne({ stadium: stadiumId, slot });
    if (existingBooking) {
        return res.status(200).json({ available: false, message: "Slot is already booked" });
    }
    res.status(200).json({ available: true, message: "Slot is available" });
}));
exports.filterBookingsByPaymentStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentStatus } = req.query;
    const bookings = yield Booking_1.default.find({ paymentStatus }).populate("user stadium");
    res.status(200).json({ message: `Bookings with payment status: ${paymentStatus}`, bookings });
}));
exports.filterBookingsByStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    const bookings = yield Booking_1.default.find({ status }).populate("user stadium");
    res.status(200).json({ message: `Bookings with status: ${status}`, bookings });
}));
