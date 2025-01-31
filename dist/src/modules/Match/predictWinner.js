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
exports.predictWinner = void 0;
const synaptic_1 = require("synaptic");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const catchError_1 = __importDefault(require("../../middleware/catchError"));
// ضبط القيم القصوى للتطبيع
const MAX_SHOTS = 20;
const MAX_ATTACKS = 10;
// بيانات التدريب
const trainingData = [
    { shotsA: 10, attacksA: 5, shotsB: 8, attacksB: 4, winner: 0 }, // فوز الفريق A
    { shotsA: 6, attacksA: 3, shotsB: 9, attacksB: 5, winner: 1 }, // فوز الفريق B
    { shotsA: 7, attacksA: 2, shotsB: 7, attacksB: 2, winner: 0.5 }, // تعادل
    { shotsA: 12, attacksA: 6, shotsB: 5, attacksB: 3, winner: 0 }, // فوز الفريق A
    { shotsA: 4, attacksA: 2, shotsB: 10, attacksB: 6, winner: 1 }, // فوز الفريق B
    { shotsA: 8, attacksA: 4, shotsB: 8, attacksB: 4, winner: 0.5 }, // تعادل
    { shotsA: 15, attacksA: 8, shotsB: 3, attacksB: 1, winner: 0 }, // فوز الفريق A
    { shotsA: 2, attacksA: 1, shotsB: 12, attacksB: 7, winner: 1 }, // فوز الفريق B
    { shotsA: 11, attacksA: 6, shotsB: 6, attacksB: 3, winner: 0 }, // فوز الفريق A
    { shotsA: 3, attacksA: 1, shotsB: 11, attacksB: 6, winner: 1 }, // فوز الفريق B
    { shotsA: 10, attacksA: 4, shotsB: 10, attacksB: 4, winner: 0.5 }, // تعادل
    { shotsA: 9, attacksA: 5, shotsB: 9, attacksB: 5, winner: 0.5 }, // تعادل
];
// تطبيع البيانات
const formattedData = trainingData.map((data) => ({
    input: [
        data.shotsA / MAX_SHOTS,
        data.attacksA / MAX_ATTACKS,
        data.shotsB / MAX_SHOTS,
        data.attacksB / MAX_ATTACKS,
    ],
    output: [data.winner],
}));
// إنشاء الشبكة العصبية
const model = new synaptic_1.Architect.Perceptron(4, 16, 8, 1); // 4 مدخلات، 16 خلية في الطبقة المخفية الأولى، 8 خلايا في الطبقة المخفية الثانية، 1 مخرج
// تدريب النموذج
const trainer = new synaptic_1.Trainer(model);
trainer.train(formattedData, {
    rate: 0.05, // معدل التعلم
    iterations: 500000, // عدد التكرارات
    error: 0.00001, // عتبة الخطأ
    shuffle: true, // خلط البيانات
    log: 10000, // طباعة الخطأ كل 10000 تكرار
});
console.log("✅ Model trained successfully!");
// حفظ النموذج
const modelPath = path_1.default.join(__dirname, "../../model.json");
fs_1.default.writeFileSync(modelPath, JSON.stringify(model.toJSON()), "utf-8");
console.log(`✅ Model saved at: ${modelPath}`);
// دالة لتحميل النموذج
const loadModel = () => {
    const modelPath = path_1.default.join(__dirname, "../../model.json");
    if (fs_1.default.existsSync(modelPath)) {
        const modelData = JSON.parse(fs_1.default.readFileSync(modelPath, "utf-8"));
        return synaptic_1.Network.fromJSON(modelData);
    }
    else {
        throw new Error("Model file not found! Please train the model first.");
    }
};
// دالة للتنبؤ
const predict = (shotsA, attacksA, shotsB, attacksB) => {
    const model = loadModel();
    const input = [
        shotsA / MAX_SHOTS,
        attacksA / MAX_ATTACKS,
        shotsB / MAX_SHOTS,
        attacksB / MAX_ATTACKS,
    ];
    const output = model.activate(input);
    return output[0]; // التأكد من أن الدالة تعيد رقمًا
};
// دالة للتعامل مع طلبات التنبؤ (مغلّفة بـ catchError)
exports.predictWinner = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shotsA, attacksA, shotsB, attacksB } = req.body;
    // التحقق من وجود جميع الحقول المطلوبة
    if (shotsA === undefined ||
        attacksA === undefined ||
        shotsB === undefined ||
        attacksB === undefined) {
        return res.status(400).json({
            error: "Please provide all required fields: shotsA, attacksA, shotsB, attacksB",
        });
    }
    // إجراء التنبؤ
    const prediction = predict(shotsA, attacksA, shotsB, attacksB);
    // تحديد الفائز بناءً على القيمة المتوقعة
    let winner = "Draw";
    if (prediction >= 0.7) {
        // Team A إذا كانت القيمة أكبر من أو تساوي 0.7
        winner = "Team A";
    }
    else if (prediction <= 0.3) {
        // Team B إذا كانت القيمة أقل من أو تساوي 0.3
        winner = "Team B";
    }
    // إرجاع النتيجة
    res.status(200).json({
        message: `The predicted winner is ${winner}`,
        prediction: prediction,
    });
}));
