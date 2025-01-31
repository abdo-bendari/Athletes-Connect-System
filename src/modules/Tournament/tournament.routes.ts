import express from 'express';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import * as T from './controller/tournament.controller';

const tournamentRouter = express.Router();

tournamentRouter
.post("/", protectedRoutes, allowedTo("owner"),T.createTournament)

.get("/", protectedRoutes,T.getAllTournaments)

.get("/:id", protectedRoutes,T.getTournamentById)

.put('/:id',protectedRoutes,allowedTo("owner"),T.updateTournament)

.delete('/:id',protectedRoutes,allowedTo("owner"),T.deleteTournament)

.patch("/:id",protectedRoutes,allowedTo("owner"),T.updateTournamentStatus)

.patch("/:id/winner",protectedRoutes,allowedTo("owner"),T.setTournamentWinner)


export default tournamentRouter;