"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModels = exports.AdminUser = exports.transactionSchema = exports.serviceSchema = exports.walletSchema = exports.userSchema = exports.adminUserSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Admin User Schema
exports.adminUserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: true });
// User Schema
exports.userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
}, { timestamps: true });
// Wallet Schema
exports.walletSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 10000 },
    hold: { type: Number, default: 100 },
    minLimit: { type: Number, default: 50 },
    maxLimit: { type: Number, default: 5000 },
    lean: { type: Number, default: 200 },
}, { timestamps: true });
// Service Schema
exports.serviceSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    serviceId: { type: String, required: true },
    slabs: { type: String, required: true },
}, { timestamps: true });
// Transaction Schema
exports.transactionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    serviceCharge: { type: Number, required: true },
    gst: { type: Number, required: true },
    prevBalance: { type: Number, required: true },
    updatedBalance: { type: Number, required: true },
    serviceId: { type: String, required: true },
    status: {
        type: String,
        enum: ['initiated', 'awaited', 'success', 'failed'],
        default: 'initiated'
    },
}, { timestamps: true });
// Create models
const createModels = (conn) => {
    return {
        User: conn.model('User', exports.userSchema),
        Wallet: conn.model('Wallet', exports.walletSchema),
        Service: conn.model('Service', exports.serviceSchema),
        Transaction: conn.model('Transaction', exports.transactionSchema),
    };
};
exports.createModels = createModels;
// Admin model is created separately as it's in a different database
const AdminUser = mongoose_1.default.model('AdminUser', exports.adminUserSchema);
exports.AdminUser = AdminUser;
