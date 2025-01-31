import express from "express";
import protectedRoutes, { allowedTo } from "../../middleware/authentication";
import * as M from "./controller/match.controller";

const matchRouter = express.Router();

matchRouter
  .post("/", protectedRoutes, allowedTo("owner"), M.createMatch)

  .get("/", protectedRoutes, allowedTo("owner"), M.getAllMatches)

  .get("/:id", protectedRoutes, M.getMatchById)

  .put("/:id", protectedRoutes, allowedTo("owner"), M.updateMatch)

  .delete("/:id", protectedRoutes, allowedTo("owner"), M.deleteMatch)

  .get("/matchResult/:id", protectedRoutes, M.getMatchResults)

  .post("/predict-winner", M.predictWinner);

export default matchRouter;
