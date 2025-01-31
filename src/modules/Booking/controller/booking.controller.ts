import Booking from "../../../../database/models/Booking";
import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";

export const createBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { user, stadium, slot, status, paymentStatus } = req.body;
  
    const booking = await Booking.create({
      user,
      stadium,
      slot,
      status: status || "pending",
      paymentStatus: paymentStatus || "unpaid",
    });
  
    res.status(201).json({ message: "Booking created successfully", booking });
  });

  export const updateBookingStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 
    const { status } = req.body;
  
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return next(new AppError("Invalid status value", 400));
    }
  
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  
    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }
  
    res.status(200).json({ message: "Booking status updated successfully", booking });
  });

  export const updatePaymentStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 
    const { paymentStatus } = req.body;
  
    if (!["paid", "unpaid"].includes(paymentStatus)) {
      return next(new AppError("Invalid payment status value", 400));
    }
  
    const booking = await Booking.findByIdAndUpdate(id, { paymentStatus }, { new: true });
  
    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }
  
    res.status(200).json({ message: "Payment status updated successfully", booking });
  });

  export const getAllBookings = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await Booking.find().populate("user stadium");
  
    res.status(200).json({ message: "All bookings fetched successfully", bookings });
  });
  
  export const getUserBookings = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
  
    const bookings = await Booking.find({ user: userId }).populate("stadium");
  
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  });
  
  export const cancelBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const booking = await Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
  
    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }
  
    res.status(200).json({ message: "Booking cancelled successfully", booking });
  });
  
  export const checkBookingAvailability = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { stadiumId, slot } = req.query;
  
    const existingBooking = await Booking.findOne({ stadium: stadiumId, slot });
  
    if (existingBooking) {
      return res.status(200).json({ available: false, message: "Slot is already booked" });
    }
  
    res.status(200).json({ available: true, message: "Slot is available" });
  });
  
  export const filterBookingsByPaymentStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { paymentStatus } = req.query;
  
    const bookings = await Booking.find({ paymentStatus }).populate("user stadium");
  
    res.status(200).json({ message: `Bookings with payment status: ${paymentStatus}`, bookings });
  });

  export const filterBookingsByStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.query;
  
    const bookings = await Booking.find({ status }).populate("user stadium");
  
    res.status(200).json({ message: `Bookings with status: ${status}`, bookings });
  });