import express from "express";
import protectedRoutes, { allowedTo } from "../../middleware/authentication";
import * as S from "./controller/stadium.controller";
const stadiumRouter = express.Router();

stadiumRouter
.post("/",S.addStadium)

.get("/nearby", S.getNearbyStadiums)

.get ("/",protectedRoutes,S.getAllStadiums)

.get ("/search",protectedRoutes,S.getStadiumByIdOrName)

.patch ("/:id",protectedRoutes,allowedTo("admin"),S.updateStadium)

.delete ("/:id",protectedRoutes,allowedTo("admin"),S.deleteStadium)

.get ("/sportType",protectedRoutes,S.getStadiumsBySportType)

.post ("/:id/reserve",protectedRoutes,allowedTo("owner"),S.reserveSlot)


export default stadiumRouter;



