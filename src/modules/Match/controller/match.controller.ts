import { AppError } from "../../../utils/Error";
import catchError from "../../../middleware/catchError";
import { NextFunction, Request, Response } from "express";
import Match from "../../../../database/models/Match";
import fs from "fs";
import path from "path";
import { Architect, Trainer, Network } from "synaptic";

// import { loadModel } from "../../../utils/trainModel";

export const createMatch = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamA, teamB, date, location, referee, status } = req.body;
    if (!teamA || !teamB || !date || !location || !referee) {
      return next(
        new AppError(
          "Please provide all required fields: teamA, teamB, date, location, and referee",
          400
        )
      );
    }
    const match = await Match.create({
      teamA,
      teamB,
      date,
      location,
      referee,
      status: status || "scheduled",
    });

    res.status(201).json({ message: "Match created successfully", match });
  }
);

export const getAllMatches = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const matches = await Match.find();

    if (!matches || matches.length === 0) {
      return next(new AppError("No matches found", 404));
    }

    res
      .status(200)
      .json({ message: "Matches retrieved successfully", matches });
  }
);

export const getMatchById = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const matchId = req.params.id;

    const match = await Match.findById(matchId);

    if (!match) {
      return next(new AppError(`No match found with ID: ${matchId}`, 404));
    }

    res.status(200).json({ message: "Match retrieved successfully", match });
  }
);
export const updateMatch = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { teamA, teamB, date, location, referee, scoreA, scoreB, status } =
      req.body;

    const match = await Match.findById(id);

    if (!match) {
      return next(new AppError(`No match found with ID: ${id}`, 404));
    }

    match.teamA = teamA || match.teamA;
    match.teamB = teamB || match.teamB;
    match.date = date || match.date;
    match.location = location || match.location;
    match.referee = referee || match.referee;
    match.scoreA = scoreA !== undefined ? scoreA : match.scoreA;
    match.scoreB = scoreB !== undefined ? scoreB : match.scoreB;
    match.status = status || match.status;

    await match.save();

    res.status(200).json({ message: "Match updated successfully", match });
  }
);

export const deleteMatch = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const matchId = req.params.id;

    const match = await Match.findByIdAndDelete(matchId);

    if (!match) {
      return next(new AppError(`No match found with ID: ${matchId}`, 404));
    }

    res.status(200).json({ message: "Match deleted successfully" });
  }
);
export const getMatchResults = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const matches = await Match.find({ status: "completed" });

    if (!matches || matches.length === 0) {
      return next(new AppError("No completed matches found", 404));
    }
    const MatchResults = matches.map(
      (match) => match.scoreA + " - " + match.scoreB
    );
    res.status(200).json({
      message: "Match results retrieved successfully",
      MatchResults: MatchResults,
    });
  }
);
const loadModel = () => {
  const modelPath = path.join(__dirname, "model.json");
  if (fs.existsSync(modelPath)) {
    const modelData = JSON.parse(fs.readFileSync(modelPath, "utf-8"));
    return Network.fromJSON(modelData);
  } else {
    throw new Error("Model file not found! Please train the model first.");
  }
};

const predict = (
  shotsA: number,
  attacksA: number,
  shotsB: number,
  attacksB: number
): number => {
  const model = loadModel();
  const input = [shotsA / 10, attacksA / 10, shotsB / 10, attacksB / 10];
  const output = model.activate(input);
  return output[0];
};


export const predictWinner = catchError(async (req, res, next) => {
  const { shotsA, attacksA, shotsB, attacksB } = req.body;

  if (
    shotsA === undefined ||
    attacksA === undefined ||
    shotsB === undefined ||
    attacksB === undefined
  ) {
    return res.status(400).json({
      error:
        "Please provide all required fields: shotsA, attacksA, shotsB, attacksB",
    });
  }

  const prediction = predict(shotsA, attacksA, shotsB, attacksB);

  let winner = "Draw";
  if (prediction >= 0.6) {
    winner = "Team A";
  } else if (prediction <= 0.4) {
    winner = "Team B";
  }

  res.status(200).json({
    message: `The predicted winner is ${winner}`,
    prediction: prediction,
  });
});