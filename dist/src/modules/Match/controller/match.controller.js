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
exports.predictWinner = exports.getMatchResults = exports.deleteMatch = exports.updateMatch = exports.getMatchById = exports.getAllMatches = exports.createMatch = void 0;
const Error_1 = require("../../../utils/Error");
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Match_1 = __importDefault(require("../../../../database/models/Match"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const synaptic_1 = require("synaptic");
// import { loadModel } from "../../../utils/trainModel";
exports.createMatch = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamA, teamB, date, location, referee, status } = req.body;
    if (!teamA || !teamB || !date || !location || !referee) {
        return next(new Error_1.AppError("Please provide all required fields: teamA, teamB, date, location, and referee", 400));
    }
    const match = yield Match_1.default.create({
        teamA,
        teamB,
        date,
        location,
        referee,
        status: status || "scheduled",
    });
    res.status(201).json({ message: "Match created successfully", match });
}));
exports.getAllMatches = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matches = yield Match_1.default.find();
    if (!matches || matches.length === 0) {
        return next(new Error_1.AppError("No matches found", 404));
    }
    res
        .status(200)
        .json({ message: "Matches retrieved successfully", matches });
}));
exports.getMatchById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matchId = req.params.id;
    const match = yield Match_1.default.findById(matchId);
    if (!match) {
        return next(new Error_1.AppError(`No match found with ID: ${matchId}`, 404));
    }
    res.status(200).json({ message: "Match retrieved successfully", match });
}));
exports.updateMatch = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { teamA, teamB, date, location, referee, scoreA, scoreB, status } = req.body;
    const match = yield Match_1.default.findById(id);
    if (!match) {
        return next(new Error_1.AppError(`No match found with ID: ${id}`, 404));
    }
    match.teamA = teamA || match.teamA;
    match.teamB = teamB || match.teamB;
    match.date = date || match.date;
    match.location = location || match.location;
    match.referee = referee || match.referee;
    match.scoreA = scoreA !== undefined ? scoreA : match.scoreA;
    match.scoreB = scoreB !== undefined ? scoreB : match.scoreB;
    match.status = status || match.status;
    yield match.save();
    res.status(200).json({ message: "Match updated successfully", match });
}));
exports.deleteMatch = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matchId = req.params.id;
    const match = yield Match_1.default.findByIdAndDelete(matchId);
    if (!match) {
        return next(new Error_1.AppError(`No match found with ID: ${matchId}`, 404));
    }
    res.status(200).json({ message: "Match deleted successfully" });
}));
exports.getMatchResults = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matches = yield Match_1.default.find({ status: "completed" });
    if (!matches || matches.length === 0) {
        return next(new Error_1.AppError("No completed matches found", 404));
    }
    const MatchResults = matches.map((match) => match.scoreA + " - " + match.scoreB);
    res.status(200).json({
        message: "Match results retrieved successfully",
        MatchResults: MatchResults,
    });
}));
const loadModel = () => {
    const modelPath = path_1.default.join(__dirname, "model.json");
    if (fs_1.default.existsSync(modelPath)) {
        const modelData = JSON.parse(fs_1.default.readFileSync(modelPath, "utf-8"));
        return synaptic_1.Network.fromJSON(modelData);
    }
    else {
        throw new Error("Model file not found! Please train the model first.");
    }
};
const predict = (shotsA, attacksA, shotsB, attacksB) => {
    const model = loadModel();
    const input = [shotsA / 10, attacksA / 10, shotsB / 10, attacksB / 10];
    const output = model.activate(input);
    return output[0];
};
exports.predictWinner = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shotsA, attacksA, shotsB, attacksB } = req.body;
    if (shotsA === undefined ||
        attacksA === undefined ||
        shotsB === undefined ||
        attacksB === undefined) {
        return res.status(400).json({
            error: "Please provide all required fields: shotsA, attacksA, shotsB, attacksB",
        });
    }
    const prediction = predict(shotsA, attacksA, shotsB, attacksB);
    let winner = "Draw";
    if (prediction >= 0.6) {
        winner = "Team A";
    }
    else if (prediction <= 0.4) {
        winner = "Team B";
    }
    res.status(200).json({
        message: `The predicted winner is ${winner}`,
        prediction: prediction,
    });
}));
