"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.createDatabase = createDatabase;
exports.getDBName = getDBName;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
async function connectDB(dbName) {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        await mongoose_1.default.connect(`${MONGO_URI}/${dbName}`);
        logger_1.logger.info(`Connected to MongoDB: ${dbName}`);
    }
    catch (error) {
        logger_1.logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
async function createDatabase(userId) {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const dbName = `sparkup_${userId}`;
        // Connect to admin database to create new database
        const adminConn = await mongoose_1.default.createConnection(`${MONGO_URI}/admin`);
        await adminConn.db?.admin().command({ create: dbName });
        await adminConn.close();
        logger_1.logger.info(`Created new database: ${dbName}`);
    }
    catch (error) {
        logger_1.logger.error('Database creation error:', error);
        throw error;
    }
}
function getDBName(userId) {
    return `sparkup_${userId}`;
}
