import mongoose from 'mongoose';
import { User, Wallet, Service, Transaction, AdminUser } from '../interfaces';
export declare const adminUserSchema: mongoose.Schema<AdminUser, mongoose.Model<AdminUser, any, any, any, mongoose.Document<unknown, any, AdminUser> & AdminUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AdminUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<AdminUser>> & mongoose.FlatRecord<AdminUser> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export declare const userSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export declare const walletSchema: mongoose.Schema<Wallet, mongoose.Model<Wallet, any, any, any, mongoose.Document<unknown, any, Wallet> & Wallet & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Wallet, mongoose.Document<unknown, {}, mongoose.FlatRecord<Wallet>> & mongoose.FlatRecord<Wallet> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export declare const serviceSchema: mongoose.Schema<Service, mongoose.Model<Service, any, any, any, mongoose.Document<unknown, any, Service> & Service & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Service, mongoose.Document<unknown, {}, mongoose.FlatRecord<Service>> & mongoose.FlatRecord<Service> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export declare const transactionSchema: mongoose.Schema<Transaction, mongoose.Model<Transaction, any, any, any, mongoose.Document<unknown, any, Transaction> & Transaction & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transaction, mongoose.Document<unknown, {}, mongoose.FlatRecord<Transaction>> & mongoose.FlatRecord<Transaction> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
declare const createModels: (conn: mongoose.Connection) => {
    User: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }> & {
        __v: number;
    }, any>;
    Wallet: mongoose.Model<Wallet, {}, {}, {}, mongoose.Document<unknown, {}, Wallet> & Wallet & Required<{
        _id: string;
    }> & {
        __v: number;
    }, any>;
    Service: mongoose.Model<Service, {}, {}, {}, mongoose.Document<unknown, {}, Service> & Service & Required<{
        _id: string;
    }> & {
        __v: number;
    }, any>;
    Transaction: mongoose.Model<Transaction, {}, {}, {}, mongoose.Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, any>;
};
declare const AdminUser: mongoose.Model<AdminUser, {}, {}, {}, mongoose.Document<unknown, {}, AdminUser> & AdminUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export { AdminUser, createModels };
