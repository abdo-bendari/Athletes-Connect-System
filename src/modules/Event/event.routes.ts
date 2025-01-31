import express from 'express';
import * as  E from './controller/event.controller';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';

const eventRouter = express.Router();

eventRouter
.post("/",protectedRoutes,allowedTo("owner"),E.createEvent)

.get("/",protectedRoutes,E.getAllEvents)

.get("/:id",protectedRoutes,E.getEventById)

.put("/:id",protectedRoutes,allowedTo("owner"),E.updateEvent)

.delete("/:id",protectedRoutes,allowedTo("owner"),E.deleteEvent)

.post("/:id/distribute-teams",protectedRoutes,E.distributeTeams)
export default eventRouter;
