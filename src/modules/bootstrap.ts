import express, { Express, Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Error";
import globalError from "../middleware/globalError";
import authRouter from "./Auth/auth.routes";
import stadiumRouter from "./Stadium/stadium.routes";
import tournamentRouter from "./Tournament/tournament.routes";
import teamRouter from "./Team/team.routes";
import bookingRouter from "./Booking/booking.routes";
import eventRouter from "./Event/event.routes";
import reviewRouter from "./Review/review.routes";
import matchRouter from "./Match/match.routes";

const bootstrap = (app: Express) => {
  process.on("uncaughtException", (err: Error) => {
    console.error("Uncaught Exception:", err);
  });
  app.use(express.json());
  const baseUrl = "/api/v1";
  app.use('/uploads',express.static('uploads'))
  // Uncomment these routes once you have the routers ready
  app.use(`${baseUrl}/auth`, authRouter);
  app.use(`${baseUrl}/stadiums`, stadiumRouter);
  app.use(`${baseUrl}/tournaments`, tournamentRouter);
  app.use(`${baseUrl}/teams`, teamRouter);
  app.use(`${baseUrl}/booking`,bookingRouter );
  app.use(`${baseUrl}/events`, eventRouter);
  app.use(`${baseUrl}/reviews`, reviewRouter);
  app.use(`${baseUrl}/matches`, matchRouter);

  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Route not found", 404));
  });
  process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection:", err);
  });
  app.use(globalError);
};

export default bootstrap;
