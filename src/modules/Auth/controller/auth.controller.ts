import jwt from "jsonwebtoken"
import { NextFunction , Request,Response} from "express";
import { AppError } from "../../../utils/Error";
import User from "../../../../database/models/User";
import catchError from "../../../middleware/catchError";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

export const signUp = catchError(async(req : Request,res :  Response,next : NextFunction)=>{
    let user = new User (req.body)
    await user.save()
    const token =jwt.sign({userId:user._id,role:user.role},process.env.JWT_KEY as string)
    res.status(200).json({message:"Signup successful",token,status:200})
})
export const signIn = catchError(async(req : Request,res :  Response,next : NextFunction)=>{
    const {email,password}=req.body
    if (!email ||!password)   return next(new AppError("Please provide email and password",400))
    const user = await User.findOne({email : email})
    if(user && bcrypt.compareSync(password,user.password)){
    const token =jwt.sign({userId:user._id,role:user.role},process.env.JWT_KEY as string)
    return  res.status(200).json({message:"Login successful",token,status:200})
    }
    return next(new AppError("Invalid email or password",401))
})

export const changeUserPassword = catchError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(user && bcrypt.compareSync(req.body.oldPassword,user.password)){
         req.body.newPassword = await bcrypt.hash(req.body.newPassword,8)
    await User.findOneAndUpdate({email:req.body.email},{ password :req.body.newPassword },{new : true})
    const token =jwt.sign({userId:user._id},process.env.JWT_KEY as string) 
    return res.status(200).json({message:"Password updated successfully",token})
    }
    return next(new AppError("Invalid email or check old password",400))
})

export const deleteUserAccount = catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("User not found", 404));
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ status: 200, message: "Account deleted successfully" });
  });
  
  export const getAllUsers = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-password");
    res.status(200).json({ status: 200, count: users.length, users });
  });

  export const getUserById = catchError(async (req: Request, res: Response, next: NextFunction) => {
     const {id} = req.params;
    if(!id){
        return next(new AppError("Please provide an id",400))
    }
    const user = await User.findById(id).select("-password");
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ status: 200, user });
  });