import express from 'express';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import * as Tm from './controller/team.controller';

const teamRouter = express.Router();
teamRouter
.post('/',Tm.createTeam)

.put('/:id',protectedRoutes,allowedTo("owner"),Tm.updateTeam)

.delete('/:id',protectedRoutes,allowedTo("owner"),Tm.deleteTeam)

.post('/:id/players',protectedRoutes,Tm.addPlayerToTeam)

.delete('/:id/players',protectedRoutes,Tm.removePlayerFromTeam)

.patch('/:id/captain',protectedRoutes,Tm.changeTeamCaptain);

teamRouter
.get('/sport-type',protectedRoutes,Tm.getTeamsBySportType)

.get('/byPlayer',protectedRoutes,Tm.getTeamsByPlayer)

.get("/without-coach",protectedRoutes,Tm.getTeamsWithoutCoach)

.get('/',protectedRoutes,allowedTo("owner"),Tm.getAllTeams)

.get('/:id',protectedRoutes,Tm.getTeamById)

teamRouter
.put('/:id/addResult',Tm.addTheMatchesResult)
.get('/:id/matches',Tm.getTeamPointsAndMatches)

export default teamRouter;


