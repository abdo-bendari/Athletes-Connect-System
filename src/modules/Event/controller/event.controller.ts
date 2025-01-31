import catchError from "../../../middleware/catchError";
import { NextFunction, Request, Response } from "express";
import Event from "../../../../database/models/Event";
import { AppError } from "../../../utils/Error";
import mongoose from "mongoose";

export const createEvent = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      sportType,
      tournament,
      teams,
      prize,
      rounds,
      matches,
      winner,
    } = req.body;

    if (!name || !sportType || !prize) {
      return next(
        new AppError("Please provide event name, sport type, and prize", 400)
      );
    }
    const teamIds =
      teams?.map((team: string) => new mongoose.Types.ObjectId(team)) || [];

    const event = await Event.create({
      name,
      sportType,
      tournament: tournament ? new mongoose.Types.ObjectId(tournament) : null,
      teams: teamIds,
      prize,
      matches,
      winner,
      rounds,
    });

    res.status(201).json({ message: "Event created successfully", event });
  }
);

export const getAllEvents = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.find().populate(
      "tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium"
    );

    res.status(200).json({ message: "Events fetched successfully", events });
  }
);

export const getEventById = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Please provide event ID", 400));
    }

    const event = await Event.findById(id).populate(
      "tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium"
    );

    if (!event) {
      return next(new AppError("Event not found", 404));
    }

    res.status(200).json({ message: "Event fetched successfully", event });
  }
);

export const updateEvent = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { teams, tournament, ...otherUpdates } = req.body;

    if (!id) {
      return next(new AppError("Please provide event ID", 400));
    }
    const teamIds =
      teams?.map((team: string) => new mongoose.Types.ObjectId(team)) || [];

    const updates = {
      ...otherUpdates,
      tournament: tournament
        ? new mongoose.Types.ObjectId(tournament)
        : undefined,
      teams: teamIds,
    };

    const event = await Event.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate(
      "tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium"
    );

    if (!event) {
      return next(new AppError("Event not found", 404));
    }

    res.status(200).json({ message: "Event updated successfully", event });
  }
);

export const deleteEvent = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Please provide event ID", 400));
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return next(new AppError("Event not found", 404));
    }

    res.status(200).json({ message: "Event deleted successfully" });
  }
);

export const distributeTeams = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Please provide event ID", 400));
    }
    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError("Event not found", 404));
    }

    if (!event.teams || event.teams.length < 2) {
      return next(new AppError("Not enough teams to distribute", 400));
    }
    const sortedTeams = event.teams
      .map((team: any) => ({
        id: team._id,
        points: team.totalPoints || 0,
        wins: team.wins || 0,
        losses: team.losses || 0,
        tie: team.tie || 0,
      }))
      .sort((a, b) => b.points - a.points); 

    const distributedGroups: {
      groupA: mongoose.Types.ObjectId[];
      groupB: mongoose.Types.ObjectId[];
    } = {
      groupA: [],
      groupB: [],
    };

    sortedTeams.forEach((team, index) => {
      if (index % 2 === 0) {
        distributedGroups.groupA.push(new mongoose.Types.ObjectId(team.id));
      } else {
        distributedGroups.groupB.push(new mongoose.Types.ObjectId(team.id));
      }
    });

    event.groups = [
      { groupName: "Group A", teams: distributedGroups.groupA },
      { groupName: "Group B", teams: distributedGroups.groupB },
    ];
    await event.save();

    res.status(200).json({
      message: "Teams distributed successfully",
      groups: event.groups,
    });
  }
);
