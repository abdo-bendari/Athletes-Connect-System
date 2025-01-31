"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.deleteUserAccount = exports.changeUserPassword = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Error_1 = require("../../../utils/Error");
const User_1 = __importDefault(require("../../../../database/models/User"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.signUp = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = new User_1.default(req.body);
    yield user.save();
    const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    res.status(200).json({ message: "Signup successful", token, status: 200 });
}));
exports.signIn = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new Error_1.AppError("Please provide email and password", 400));
    const user = yield User_1.default.findOne({ email: email });
    if (user && bcrypt_1.default.compareSync(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
        return res.status(200).json({ message: "Login successful", token, status: 200 });
    }
    return next(new Error_1.AppError("Invalid email or password", 401));
}));
exports.changeUserPassword = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (user && bcrypt_1.default.compareSync(req.body.oldPassword, user.password)) {
        req.body.newPassword = yield bcrypt_1.default.hash(req.body.newPassword, 8);
        yield User_1.default.findOneAndUpdate({ email: req.body.email }, { password: req.body.newPassword }, { new: true });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ message: "Password updated successfully", token });
    }
    return next(new Error_1.AppError("Invalid email or check old password", 400));
}));
exports.deleteUserAccount = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return next(new Error_1.AppError("User not found", 404));
    const user = yield User_1.default.findByIdAndDelete(req.user.userId);
    if (!user)
        return next(new Error_1.AppError("User not found", 404));
    res.status(200).json({ status: 200, message: "Account deleted successfully" });
}));
exports.getAllUsers = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find().select("-password");
    res.status(200).json({ status: 200, count: users.length, users });
}));
exports.getUserById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide an id", 400));
    }
    const user = yield User_1.default.findById(id).select("-password");
    if (!user)
        return next(new Error_1.AppError("User not found", 404));
    res.status(200).json({ status: 200, user });
}));
