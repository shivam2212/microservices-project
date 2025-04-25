"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
const generateToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET missing in environment');
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET missing in environment');
    }
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
