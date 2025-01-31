import express from "express";
import protectedRoutes, { allowedTo } from "../../middleware/authentication";
import * as B from "./controller/booking.controller";

const bookingRouter = express.Router();
bookingRouter.use(protectedRoutes,allowedTo('owner'))

bookingRouter
.post("/",B.createBooking)

.put("/:id/status",B.updateBookingStatus)

.put("/:id/paymentStatus",B.updatePaymentStatus)

.get("/",B.getAllBookings)

.get("/user/:userId",B.getUserBookings)

.delete("/:id",B.cancelBooking)

.get("/availability",B.checkBookingAvailability)

.get("/byPayment",B.filterBookingsByPaymentStatus)

.get("/byStatus",B.filterBookingsByStatus)

export default bookingRouter;

