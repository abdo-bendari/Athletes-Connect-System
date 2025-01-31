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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeTeams = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Event_1 = __importDefault(require("../../../../database/models/Event"));
const Error_1 = require("../../../utils/Error");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createEvent = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sportType, tournament, teams, prize, rounds, matches, winner, } = req.body;
    if (!name || !sportType || !prize) {
        return next(new Error_1.AppError("Please provide event name, sport type, and prize", 400));
    }
    const teamIds = (teams === null || teams === void 0 ? void 0 : teams.map((team) => new mongoose_1.default.Types.ObjectId(team))) || [];
    const event = yield Event_1.default.create({
        name,
        sportType,
        tournament: tournament ? new mongoose_1.default.Types.ObjectId(tournament) : null,
        teams: teamIds,
        prize,
        matches,
        winner,
        rounds,
    });
    res.status(201).json({ message: "Event created successfully", event });
}));
exports.getAllEvents = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield Event_1.default.find().populate("tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium");
    res.status(200).json({ message: "Events fetched successfully", events });
}));
exports.getEventById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide event ID", 400));
    }
    const event = yield Event_1.default.findById(id).populate("tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium");
    if (!event) {
        return next(new Error_1.AppError("Event not found", 404));
    }
    res.status(200).json({ message: "Event fetched successfully", event });
}));
exports.updateEvent = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { teams, tournament } = _a, otherUpdates = __rest(_a, ["teams", "tournament"]);
    if (!id) {
        return next(new Error_1.AppError("Please provide event ID", 400));
    }
    const teamIds = (teams === null || teams === void 0 ? void 0 : teams.map((team) => new mongoose_1.default.Types.ObjectId(team))) || [];
    const updates = Object.assign(Object.assign({}, otherUpdates), { tournament: tournament
            ? new mongoose_1.default.Types.ObjectId(tournament)
            : undefined, teams: teamIds });
    const event = yield Event_1.default.findByIdAndUpdate(id, updates, {
        new: true,
    }).populate("tournament teams stadiums groups.teams rounds.matches.team1 rounds.matches.team2 rounds.matches.stadium");
    if (!event) {
        return next(new Error_1.AppError("Event not found", 404));
    }
    res.status(200).json({ message: "Event updated successfully", event });
}));
exports.deleteEvent = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide event ID", 400));
    }
    const event = yield Event_1.default.findByIdAndDelete(id);
    if (!event) {
        return next(new Error_1.AppError("Event not found", 404));
    }
    res.status(200).json({ message: "Event deleted successfully" });
}));
exports.distributeTeams = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide event ID", 400));
    }
    const event = yield Event_1.default.findById(id);
    if (!event) {
        return next(new Error_1.AppError("Event not found", 404));
    }
    if (!event.teams || event.teams.length < 2) {
        return next(new Error_1.AppError("Not enough teams to distribute", 400));
    }
    const sortedTeams = event.teams
        .map((team) => ({
        id: team._id,
        points: team.totalPoints || 0,
        wins: team.wins || 0,
        losses: team.losses || 0,
        tie: team.tie || 0,
    }))
        .sort((a, b) => b.points - a.points);
    const distributedGroups = {
        groupA: [],
        groupB: [],
    };
    sortedTeams.forEach((team, index) => {
        if (index % 2 === 0) {
            distributedGroups.groupA.push(new mongoose_1.default.Types.ObjectId(team.id));
        }
        else {
            distributedGroups.groupB.push(new mongoose_1.default.Types.ObjectId(team.id));
        }
    });
    event.groups = [
        { groupName: "Group A", teams: distributedGroups.groupA },
        { groupName: "Group B", teams: distributedGroups.groupB },
    ];
    yield event.save();
    res.status(200).json({
        message: "Teams distributed successfully",
        groups: event.groups,
    });
}));
