"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = dbConnection;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function dbConnection() {
    (0, mongoose_1.connect)(process.env.MONGO_URI)
        .then(() => {
        console.log("database connected successfully");
    })
        .catch(() => {
        console.log("database connected failed");
    });
}
