"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Error_1 = require("../utils/Error");
const globalError_1 = __importDefault(require("../middleware/globalError"));
const auth_routes_1 = __importDefault(require("./Auth/auth.routes"));
const stadium_routes_1 = __importDefault(require("./Stadium/stadium.routes"));
const tournament_routes_1 = __importDefault(require("./Tournament/tournament.routes"));
const team_routes_1 = __importDefault(require("./Team/team.routes"));
const booking_routes_1 = __importDefault(require("./Booking/booking.routes"));
const event_routes_1 = __importDefault(require("./Event/event.routes"));
const review_routes_1 = __importDefault(require("./Review/review.routes"));
const match_routes_1 = __importDefault(require("./Match/match.routes"));
const bootstrap = (app) => {
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
    });
    app.use(express_1.default.json());
    const baseUrl = "/api/v1";
    app.use('/uploads', express_1.default.static('uploads'));
    // Uncomment these routes once you have the routers ready
    app.use(`${baseUrl}/auth`, auth_routes_1.default);
    app.use(`${baseUrl}/stadiums`, stadium_routes_1.default);
    app.use(`${baseUrl}/tournaments`, tournament_routes_1.default);
    app.use(`${baseUrl}/teams`, team_routes_1.default);
    app.use(`${baseUrl}/booking`, booking_routes_1.default);
    app.use(`${baseUrl}/events`, event_routes_1.default);
    app.use(`${baseUrl}/reviews`, review_routes_1.default);
    app.use(`${baseUrl}/matches`, match_routes_1.default);
    app.use("*", (req, res, next) => {
        next(new Error_1.AppError("Route not found", 404));
    });
    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
    });
    app.use(globalError_1.default);
};
exports.default = bootstrap;
