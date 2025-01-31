"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const eventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    tournament: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tournament",
        default: null,
    },
    sportType: {
        type: String,
        enum: ["football", "tennis", "paddle"],
        required: true,
    },
    teams: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    stadiums: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Stadium",
        },
    ],
    groups: [
        {
            groupName: { type: String, required: true },
            teams: [
                {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "Team",
                },
            ],
        },
    ],
    rounds: [
        {
            roundName: {
                type: String,
                enum: ["group", "quarterfinal", "semifinal", "final"],
                required: true,
            },
            matches: [
                {
                    team1: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: "Team",
                        required: true,
                    },
                    team2: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: "Team",
                        required: true,
                    },
                    stadium: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: "Stadium",
                        required: true,
                    },
                    matchDate: {
                        type: Date,
                        required: true,
                    },
                    result: {
                        team1Score: { type: Number, default: 0 },
                        team2Score: { type: Number, default: 0 },
                    },
                },
            ],
        },
    ],
    prize: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed"],
        default: "upcoming",
    },
    winner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
}, { timestamps: true });
const Event = mongoose_1.default.model("Event", eventSchema);
exports.default = Event;
