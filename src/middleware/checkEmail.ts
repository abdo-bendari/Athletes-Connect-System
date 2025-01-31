import { AppError } from './../utils/Error';
import User from "../../database/models/User";
import {  Request, Response, NextFunction } from "express";

export const checkEmail = async (req : Request, res : Response, next: NextFunction) => {
    let isExist = await User.findOne({ email: req.body.email });
    if (isExist) return next(new AppError("email already exist", 409));
    next();
  }