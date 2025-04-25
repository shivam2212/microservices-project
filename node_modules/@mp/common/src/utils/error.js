"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.NotFoundError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
class NotFoundError extends ApplicationError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends ApplicationError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends ApplicationError {
    constructor(message = 'You are not authorized') {
        super(message, 403);
    }
}
exports.AuthorizationError = AuthorizationError;
