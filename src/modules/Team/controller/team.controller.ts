import Team from "../../../../database/models/Team";
import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";

export const createTeam = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, sportType, players, coach, captain } = req.body;
  
    if (!name || !sportType || !captain) {
      return next(new AppError("Please provide team name, sport type, and captain", 400));
    }
  
    const team = await Team.create({
      name,
      sportType,
      players: players || [],
      coach: coach || null,
      captain ,
    });
  
    res.status(201).json({ message: "Team created successfully", team });
  });

  export const getAllTeams = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const teams = await Team.find().populate("players coach captain");
  
    res.status(200).json({ message: "Teams fetched successfully", teams });
  });
  
  export const getTeamById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id ){
      return next(new AppError("Please provide team id", 400));
    }
  
    const team = await Team.findById(id).populate("players coach captain");
  
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    res.status(200).json({ message: "Team fetched successfully", team });
  });


  export const updateTeam = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;
  if (!id || !updates) {
    return next(new AppError("Please provide team id and updates", 400));
  }
    const team = await Team.findByIdAndUpdate(id, updates, { new: true }).populate("players coach captain");
  
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    res.status(200).json({ message: "Team updated successfully", team });
  });
  
  
  export const deleteTeam = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  if (!id) {
    return next(new AppError("Please provide team id", 400));
  }
    const team = await Team.findByIdAndDelete(id);
  
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    res.status(200).json({ message: "Team deleted successfully" });
  });
  
  export const addPlayerToTeam = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;  // Team ID
    const { playerId } = req.body; 
  
    if (!playerId) {
      return next(new AppError("Please provide player ID", 400));
    }
  
    const team = await Team.findById(id);
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    if (team.players.includes(playerId)) {
      return next(new AppError("Player already exists in the team", 400));
    }
    team.players.push(playerId);
    await team.save();
  
    res.status(200).json({ message: "Player added successfully", team });
  });
  
  export const removePlayerFromTeam = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Team ID
    const { playerId } = req.body; 
  
    const team = await Team.findById(id);
  
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    const playerIndex = team.players.indexOf(playerId);
    if (playerIndex === -1) {
      return next(new AppError("Player not found in the team", 404));
    }
  
    team.players.splice(playerIndex, 1);
    await team.save();
  
    res.status(200).json({ message: "Player removed successfully", team });
  });
  

  export const getTeamsBySportType = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { sportType } = req.query;
  
    if (!sportType) {
      return next(new AppError("Please provide sport type", 400));
    }
  
    const teams = await Team.find({ sportType });
  
    res.status(200).json({ message: `Teams fetched for sport type: ${sportType}`, teams });
  });
  
  export const getTeamsByPlayer = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.query;
  
    if (!playerId) {
      return next(new AppError("Please provide player ID", 400));
    }
  
    const teams = await Team.find({ players: playerId }).populate("players coach captain");
  
    res.status(200).json({ message: "Teams fetched successfully", teams });
  });
  
  export const changeTeamCaptain = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 
    const { newCaptainId } = req.body; 
  
    const team = await Team.findById(id);
  
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  
    if (!team.players.includes(newCaptainId)) {
      return next(new AppError("New captain must be a player in the team", 400));
    }
  
    team.captain = newCaptainId;
    await team.save();
  
    res.status(200).json({ message: "Team captain changed successfully", team });
  });
  
  export const getTeamsWithoutCoach = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const teams = await Team.find({ coach: null }).populate("players captain");
  
    res.status(200).json({ message: "Teams without coach fetched successfully", teams });
  });
  
  export const  addTheMatchesResult = catchError(async (req: Request, res: Response, next: NextFunction) =>{
    const {id} = req.params;
    const { wins , losses , tie} = req.body;
    if(!id){
      return next(new AppError("Please provide team id", 400));
    }
    const team = await Team.findById(id);
    if(!team){
      return next(new AppError("Team not found", 404));
    }
    if(wins < 0 || losses < 0 || tie < 0){
      return next(new AppError("Please provide valid values for wins, losses and tie", 400));
    }
    team.wins = wins;
    team.losses = losses;
    team.tie = tie;
    team.totalPoints = wins * 3 + tie;
    team.totalMatches = wins + losses + tie;
   await team.save();
    res.status(200).json({message: "Matches result added successfully", team});
  
  })

  export const getTeamPointsAndMatches = catchError(async (req: Request, res: Response, next: NextFunction) =>{
    const {id} = req.params;
    if(!id){
      return next(new AppError("Please provide team id", 400));
    }
    const team = await Team.findById(id);
    if (!team){
      return next(new AppError("Team not found", 404));
    }
    res.status(200).json({message: "Team points fetched successfully",totalPoint : team.totalPoints, totalMatches : team.totalMatches});
  })

