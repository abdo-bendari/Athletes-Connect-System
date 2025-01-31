import * as A from "./controller/auth.controller";
import express from "express";
import { checkEmail } from "../../middleware/checkEmail";
import protectedRoutes, { allowedTo } from "../../middleware/authentication";
const authRouter = express.Router();

authRouter
  .post("/signUp", checkEmail, A.signUp)

  .post("/signIn", A.signIn)

  .patch("/", A.changeUserPassword)

  .get("/", protectedRoutes, allowedTo("admin"), A.getAllUsers)

  .get("/:id", protectedRoutes, allowedTo("admin"), A.getUserById)

  .delete("/", protectedRoutes, allowedTo("athlete"), A.deleteUserAccount);

export default authRouter;
