import mongoose, { Schema } from 'mongoose';
import { User, Wallet, Service, Transaction, AdminUser } from '../interfaces';

// Admin User Schema
export const adminUserSchema = new Schema<AdminUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: true });

// User Schema
export const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
}, { timestamps: true });

// Wallet Schema
export const walletSchema = new Schema<Wallet>({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 10000 },
  hold: { type: Number, default: 100 },
  minLimit: { type: Number, default: 50 },
  maxLimit: { type: Number, default: 5000 },
  lean: { type: Number, default: 200 },
}, { timestamps: true });

// Service Schema
export const serviceSchema = new Schema<Service>({
  userId: { type: String, required: true },
  serviceId: { type: String, required: true },
  slabs: { type: String, required: true },
}, { timestamps: true });

// Transaction Schema
export const transactionSchema = new Schema<Transaction>({
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
const createModels = (conn: mongoose.Connection) => {
  return {
    User: conn.model<User>('User', userSchema),
    Wallet: conn.model<Wallet>('Wallet', walletSchema),
    Service: conn.model<Service>('Service', serviceSchema),
    Transaction: conn.model<Transaction>('Transaction', transactionSchema),
  };
};

// Admin model is created separately as it's in a different database
const AdminUser = mongoose.model<AdminUser>('AdminUser', adminUserSchema);

export { AdminUser, createModels };