"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const matchSchema = new mongoose_1.Schema({
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["scheduled", "completed", "canceled"],
        default: "scheduled",
    },
    referee: { type: String, required: true },
});
const Match = (0, mongoose_1.model)("Match", matchSchema);
exports.default = Match;
