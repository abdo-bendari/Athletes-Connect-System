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
exports.getTeamPointsAndMatches = exports.addTheMatchesResult = exports.getTeamsWithoutCoach = exports.changeTeamCaptain = exports.getTeamsByPlayer = exports.getTeamsBySportType = exports.removePlayerFromTeam = exports.addPlayerToTeam = exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getAllTeams = exports.createTeam = void 0;
const Team_1 = __importDefault(require("../../../../database/models/Team"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
exports.createTeam = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sportType, players, coach, captain } = req.body;
    if (!name || !sportType || !captain) {
        return next(new Error_1.AppError("Please provide team name, sport type, and captain", 400));
    }
    const team = yield Team_1.default.create({
        name,
        sportType,
        players: players || [],
        coach: coach || null,
        captain,
    });
    res.status(201).json({ message: "Team created successfully", team });
}));
exports.getAllTeams = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield Team_1.default.find().populate("players coach captain");
    res.status(200).json({ message: "Teams fetched successfully", teams });
}));
exports.getTeamById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide team id", 400));
    }
    const team = yield Team_1.default.findById(id).populate("players coach captain");
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    res.status(200).json({ message: "Team fetched successfully", team });
}));
exports.updateTeam = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    if (!id || !updates) {
        return next(new Error_1.AppError("Please provide team id and updates", 400));
    }
    const team = yield Team_1.default.findByIdAndUpdate(id, updates, { new: true }).populate("players coach captain");
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    res.status(200).json({ message: "Team updated successfully", team });
}));
exports.deleteTeam = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide team id", 400));
    }
    const team = yield Team_1.default.findByIdAndDelete(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    res.status(200).json({ message: "Team deleted successfully" });
}));
exports.addPlayerToTeam = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Team ID
    const { playerId } = req.body;
    if (!playerId) {
        return next(new Error_1.AppError("Please provide player ID", 400));
    }
    const team = yield Team_1.default.findById(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    if (team.players.includes(playerId)) {
        return next(new Error_1.AppError("Player already exists in the team", 400));
    }
    team.players.push(playerId);
    yield team.save();
    res.status(200).json({ message: "Player added successfully", team });
}));
exports.removePlayerFromTeam = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Team ID
    const { playerId } = req.body;
    const team = yield Team_1.default.findById(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    const playerIndex = team.players.indexOf(playerId);
    if (playerIndex === -1) {
        return next(new Error_1.AppError("Player not found in the team", 404));
    }
    team.players.splice(playerIndex, 1);
    yield team.save();
    res.status(200).json({ message: "Player removed successfully", team });
}));
exports.getTeamsBySportType = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sportType } = req.query;
    if (!sportType) {
        return next(new Error_1.AppError("Please provide sport type", 400));
    }
    const teams = yield Team_1.default.find({ sportType });
    res.status(200).json({ message: `Teams fetched for sport type: ${sportType}`, teams });
}));
exports.getTeamsByPlayer = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId } = req.query;
    if (!playerId) {
        return next(new Error_1.AppError("Please provide player ID", 400));
    }
    const teams = yield Team_1.default.find({ players: playerId }).populate("players coach captain");
    res.status(200).json({ message: "Teams fetched successfully", teams });
}));
exports.changeTeamCaptain = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { newCaptainId } = req.body;
    const team = yield Team_1.default.findById(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    if (!team.players.includes(newCaptainId)) {
        return next(new Error_1.AppError("New captain must be a player in the team", 400));
    }
    team.captain = newCaptainId;
    yield team.save();
    res.status(200).json({ message: "Team captain changed successfully", team });
}));
exports.getTeamsWithoutCoach = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield Team_1.default.find({ coach: null }).populate("players captain");
    res.status(200).json({ message: "Teams without coach fetched successfully", teams });
}));
exports.addTheMatchesResult = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { wins, losses, tie } = req.body;
    if (!id) {
        return next(new Error_1.AppError("Please provide team id", 400));
    }
    const team = yield Team_1.default.findById(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    if (wins < 0 || losses < 0 || tie < 0) {
        return next(new Error_1.AppError("Please provide valid values for wins, losses and tie", 400));
    }
    team.wins = wins;
    team.losses = losses;
    team.tie = tie;
    team.totalPoints = wins * 3 + tie;
    team.totalMatches = wins + losses + tie;
    yield team.save();
    res.status(200).json({ message: "Matches result added successfully", team });
}));
exports.getTeamPointsAndMatches = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide team id", 400));
    }
    const team = yield Team_1.default.findById(id);
    if (!team) {
        return next(new Error_1.AppError("Team not found", 404));
    }
    res.status(200).json({ message: "Team points fetched successfully", totalPoint: team.totalPoints, totalMatches: team.totalMatches });
}));
