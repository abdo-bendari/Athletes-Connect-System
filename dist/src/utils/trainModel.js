"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const synaptic_1 = require("synaptic");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MAX_SHOTS = 20;
const MAX_ATTACKS = 10;
const trainingData = [
    { shotsA: 10, attacksA: 5, shotsB: 8, attacksB: 4, winner: 0 },
    { shotsA: 6, attacksA: 3, shotsB: 9, attacksB: 5, winner: 1 },
    { shotsA: 7, attacksA: 2, shotsB: 7, attacksB: 2, winner: 0.5 },
    { shotsA: 12, attacksA: 6, shotsB: 5, attacksB: 3, winner: 0 },
    { shotsA: 4, attacksA: 2, shotsB: 10, attacksB: 6, winner: 1 },
    { shotsA: 8, attacksA: 4, shotsB: 8, attacksB: 4, winner: 0.5 },
    { shotsA: 15, attacksA: 8, shotsB: 3, attacksB: 1, winner: 0 },
    { shotsA: 2, attacksA: 1, shotsB: 12, attacksB: 7, winner: 1 },
    { shotsA: 11, attacksA: 6, shotsB: 6, attacksB: 3, winner: 0 },
    { shotsA: 3, attacksA: 1, shotsB: 11, attacksB: 6, winner: 1 },
    { shotsA: 10, attacksA: 4, shotsB: 10, attacksB: 4, winner: 0.5 },
    { shotsA: 9, attacksA: 5, shotsB: 9, attacksB: 5, winner: 0.5 },
];
const formattedData = trainingData.map((data) => ({
    input: [
        data.shotsA / MAX_SHOTS,
        data.attacksA / MAX_ATTACKS,
        data.shotsB / MAX_SHOTS,
        data.attacksB / MAX_ATTACKS,
    ],
    output: [data.winner],
}));
const model = new synaptic_1.Architect.Perceptron(4, 16, 8, 1);
const trainer = new synaptic_1.Trainer(model);
trainer.train(formattedData, {
    rate: 0.05,
    iterations: 500000,
    error: 0.00001,
    shuffle: true,
    log: 10000,
});
console.log("✅ Model trained successfully!");
const modelPath = path_1.default.join(__dirname, "../../model.json");
fs_1.default.writeFileSync(modelPath, JSON.stringify(model.toJSON()), "utf-8");
console.log(`✅ Model saved at: ${modelPath}`);
