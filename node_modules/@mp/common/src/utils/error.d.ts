export declare class ApplicationError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare class NotFoundError extends ApplicationError {
    constructor(message?: string);
}
export declare class ValidationError extends ApplicationError {
    constructor(message?: string);
}
export declare class AuthenticationError extends ApplicationError {
    constructor(message?: string);
}
export declare class AuthorizationError extends ApplicationError {
    constructor(message?: string);
}
