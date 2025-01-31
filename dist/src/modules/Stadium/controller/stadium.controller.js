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
exports.reserveSlot = exports.getStadiumsBySportType = exports.deleteStadium = exports.updateStadium = exports.getStadiumByIdOrName = exports.getAllStadiums = exports.getNearbyStadiums = exports.addStadium = void 0;
const Stadium_1 = __importDefault(require("../../../../database/models/Stadium"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
exports.addStadium = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, sportType, capacity, pricePerHour, owner, location, facilities, imageUrl, isIndoor, availableSlots, } = req.body;
    if (!name || !address || !sportType || !capacity || !pricePerHour || !owner) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    const stadium = new Stadium_1.default({
        name,
        address,
        sportType,
        capacity,
        pricePerHour,
        owner,
        location,
        facilities,
        imageUrl,
        isIndoor,
        availableSlots,
    });
    yield stadium.save();
    return res.status(201).json({ message: "Stadium added successfully", stadium });
}));
exports.getNearbyStadiums = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { longitude, latitude, maxDistance } = req.query;
    if (!longitude || !latitude) {
        return next(new Error_1.AppError("Please provide longitude and latitude", 400));
    }
    const distance = maxDistance ? parseInt(maxDistance, 10) : 5000; // Default: 5km
    const stadiums = yield Stadium_1.default.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                distanceField: "distance",
                spherical: true,
                maxDistance: distance, // Maximum distance in meters
            },
        },
    ]);
    res.status(200).json({ message: "Success", stadiums });
}));
exports.getAllStadiums = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stadiums = yield Stadium_1.default.find();
    if (stadiums.length === 0) {
        return next(new Error_1.AppError("No stadiums found", 404));
    }
    return res.status(200).json({ message: "Success", totalCount: stadiums.length, stadiums });
}));
exports.getStadiumByIdOrName = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.query;
    if (!id && !name) {
        return next(new Error_1.AppError("Please provide stadium ID or name", 400));
    }
    const stadium = yield Stadium_1.default.findOne({
        $or: [{ _id: id }, { name: name }],
    });
    if (!stadium) {
        return next(new Error_1.AppError("Stadium not found", 404));
    }
    return res.status(200).json({ message: "Success", stadium });
}));
exports.updateStadium = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide stadium ID", 400));
    }
    const stadium = yield Stadium_1.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!stadium) {
        return next(new Error_1.AppError("Stadium not found", 404));
    }
    return res.status(200).json({ message: "Stadium updated successfully", stadium });
}));
exports.deleteStadium = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("Please provide stadium ID", 400));
    }
    const stadium = yield Stadium_1.default.findByIdAndDelete(id);
    if (!stadium) {
        return next(new Error_1.AppError("Stadium not found", 404));
    }
    return res.status(200).json({ message: "Stadium deleted successfully" });
}));
exports.getStadiumsBySportType = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sportType } = req.query;
    if (!sportType) {
        return next(new Error_1.AppError("Please provide sport type", 400));
    }
    const stadiums = yield Stadium_1.default.find({ sportType });
    if (stadiums.length === 0) {
        return next(new Error_1.AppError("No stadiums found for this sport type", 404));
    }
    return res.status(200).json({ message: "Success", stadiums });
}));
exports.reserveSlot = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { slot } = req.body;
    if (!id || !slot) {
        return next(new Error_1.AppError("Please provide stadium ID and slot", 400));
    }
    const stadium = yield Stadium_1.default.findById(id);
    if (!stadium) {
        return next(new Error_1.AppError("Stadium not found", 404));
    }
    if (!stadium.availableSlots.includes(slot)) {
        return next(new Error_1.AppError("Slot not available", 400));
    }
    stadium.availableSlots = stadium.availableSlots.filter((s) => s !== slot);
    yield stadium.save();
    return res.status(200).json({ message: "Slot reserved successfully", stadium });
}));
