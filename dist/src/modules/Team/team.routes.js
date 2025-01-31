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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importStar(require("../../middleware/authentication"));
const Tm = __importStar(require("./controller/team.controller"));
const teamRouter = express_1.default.Router();
teamRouter
    .post('/', Tm.createTeam)
    .put('/:id', authentication_1.default, (0, authentication_1.allowedTo)("owner"), Tm.updateTeam)
    .delete('/:id', authentication_1.default, (0, authentication_1.allowedTo)("owner"), Tm.deleteTeam)
    .post('/:id/players', authentication_1.default, Tm.addPlayerToTeam)
    .delete('/:id/players', authentication_1.default, Tm.removePlayerFromTeam)
    .patch('/:id/captain', authentication_1.default, Tm.changeTeamCaptain);
teamRouter
    .get('/sport-type', authentication_1.default, Tm.getTeamsBySportType)
    .get('/byPlayer', authentication_1.default, Tm.getTeamsByPlayer)
    .get("/without-coach", authentication_1.default, Tm.getTeamsWithoutCoach)
    .get('/', authentication_1.default, (0, authentication_1.allowedTo)("owner"), Tm.getAllTeams)
    .get('/:id', authentication_1.default, Tm.getTeamById);
teamRouter
    .put('/:id/addResult', Tm.addTheMatchesResult)
    .get('/:id/matches', Tm.getTeamPointsAndMatches);
exports.default = teamRouter;
