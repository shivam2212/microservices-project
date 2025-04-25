export interface User {
    _id?: string;
    name: string;
    email: string;
    mobile: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Wallet {
    _id?: string;
    userId: string;
    balance: number;
    hold: number;
    minLimit: number;
    maxLimit: number;
    lean: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Service {
    _id?: string;
    userId: string;
    serviceId: string;
    slabs: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Transaction {
    _id?: string;
    userId: string;
    amount: number;
    serviceCharge: number;
    gst: number;
    prevBalance: number;
    updatedBalance: number;
    serviceId: string;
    status: 'initiated' | 'awaited' | 'success' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AdminUser {
    _id?: string;
    username: string;
    password: string;
    role: 'admin' | 'superadmin';
    createdAt?: Date;
    updatedAt?: Date;
}
