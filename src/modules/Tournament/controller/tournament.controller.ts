import catchError from "../../../middleware/catchError";
import Tournament from "../../../../database/models/Tournament";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";

export const createTournament = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, sportType, stadium, teams, startDate, endDate, prize } =
      req.body;

    if (!name || !sportType || !stadium || !startDate || !endDate || !prize) {
      return next(new AppError("Please provide all required fields", 400));
    }

    const newTournament = await Tournament.create({
      name,
      sportType,
      stadium,
      teams,
      startDate,
      endDate,
      prize,
    });

    res
      .status(201)
      .json({
        message: "Tournament created successfully",
        tournament: newTournament,
      });
  }
);

export const getAllTournaments = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournaments = await Tournament.find()
      .populate("stadium")
      .populate("teams")
      .populate("winner");

    if (!tournaments) {
      return next(new AppError("Tournaments not found", 404));
    }

    res
      .status(200)
      .json({
        message: "Tournaments retrieved successfully",
        totalCount: tournaments.length,
        tournaments,
      });
  }
);

export const getTournamentById = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("Please provide an id", 400));
    }
    const tournament = await Tournament.findById(id)
      .populate("stadium")
      .populate("teams")
      .populate("winner");

    if (!tournament) {
      return next(new AppError("Tournament not found", 404));
    }

    res
      .status(200)
      .json({ message: "Tournament retrieved successfully", tournament });
  }
);

export const updateTournament = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!id){
      return next(new AppError("Please provide an id", 400));
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTournament) {
      return next(new AppError("Tournament not found", 404));
    }

    res
      .status(200)
      .json({
        message: "Tournament updated successfully",
        tournament: updatedTournament,
      });
  }
);

export const deleteTournament = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
  if (!id){
    return next(new AppError("Please provide an id", 400));
  }
      const tournament = await Tournament.findByIdAndDelete(id);
  
      if (!tournament) {
        return next(new AppError("Tournament not found", 404));
      }
  
      res.status(200).json({ message: "Tournament deleted successfully" });
    }
  );
  
  export const updateTournamentStatus = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { status } = req.body;
  if(!id || !status){
    return next(new AppError("Please provide an id and status", 400));
  }
      if (!["scheduled", "ongoing", "completed"].includes(status)) {
        return next(new AppError("Invalid status value", 400));
      }
  
      const tournament = await Tournament.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!tournament) {
        return next(new AppError("Tournament not found", 404));
      }
  
      res.status(200).json({ message: "Tournament status updated successfully", tournament });
    }
  );
  
  export const setTournamentWinner = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { winner } = req.body;
  if(!id || !winner){
    return next(new AppError("Please provide an id and winner", 400));
  }
      const tournament = await Tournament.findById(id);
  
      if (!tournament) {
        return next(new AppError("Tournament not found", 404));
      }
  
      tournament.winner = winner;
      await tournament.save();
  
      res.status(200).json({ message: "Winner set successfully", tournament });
    }
  );
  