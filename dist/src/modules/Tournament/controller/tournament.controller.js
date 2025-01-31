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
exports.setTournamentWinner = exports.updateTournamentStatus = exports.deleteTournament = exports.updateTournament = exports.getTournamentById = exports.getAllTournaments = exports.createTournament = void 0;
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Tournament_1 = __importDefault(require("../../../../database/models/Tournament"));
const Error_1 = require("../../../utils/Error");
exports.createTournament = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sportType, stadium, teams, startDate, endDate, prize } = req.body;
    if (!name || !sportType || !stadium || !startDate || !endDate || !prize) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    const newTournament = yield Tournament_1.default.create({
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
}));
exports.getAllTournaments = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tournaments = yield Tournament_1.default.find()
        .populate("stadium")
        .populate("teams")
        .populate("winner");
    if (!tournaments) {
        return next(new Error_1.AppError("Tournaments not found", 404));
    }
    res
        .status(200)
        .json({
        message: "Tournaments retrieved successfully",
        totalCount: tournaments.length,
        tournaments,
    });
}));
exports.getTournamentById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide an id", 400));
    }
    const tournament = yield Tournament_1.default.findById(id)
        .populate("stadium")
        .populate("teams")
        .populate("winner");
    if (!tournament) {
        return next(new Error_1.AppError("Tournament not found", 404));
    }
    res
        .status(200)
        .json({ message: "Tournament retrieved successfully", tournament });
}));
exports.updateTournament = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide an id", 400));
    }
    const updatedTournament = yield Tournament_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedTournament) {
        return next(new Error_1.AppError("Tournament not found", 404));
    }
    res
        .status(200)
        .json({
        message: "Tournament updated successfully",
        tournament: updatedTournament,
    });
}));
exports.deleteTournament = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide an id", 400));
    }
    const tournament = yield Tournament_1.default.findByIdAndDelete(id);
    if (!tournament) {
        return next(new Error_1.AppError("Tournament not found", 404));
    }
    res.status(200).json({ message: "Tournament deleted successfully" });
}));
exports.updateTournamentStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
        return next(new Error_1.AppError("Please provide an id and status", 400));
    }
    if (!["scheduled", "ongoing", "completed"].includes(status)) {
        return next(new Error_1.AppError("Invalid status value", 400));
    }
    const tournament = yield Tournament_1.default.findByIdAndUpdate(id, { status }, { new: true });
    if (!tournament) {
        return next(new Error_1.AppError("Tournament not found", 404));
    }
    res.status(200).json({ message: "Tournament status updated successfully", tournament });
}));
exports.setTournamentWinner = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { winner } = req.body;
    if (!id || !winner) {
        return next(new Error_1.AppError("Please provide an id and winner", 400));
    }
    const tournament = yield Tournament_1.default.findById(id);
    if (!tournament) {
        return next(new Error_1.AppError("Tournament not found", 404));
    }
    tournament.winner = winner;
    yield tournament.save();
    res.status(200).json({ message: "Winner set successfully", tournament });
}));
