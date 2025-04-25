export class ApplicationError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class NotFoundError extends ApplicationError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
  export class ValidationError extends ApplicationError {
    constructor(message: string = 'Validation failed') {
      super(message, 400);
    }
  }
  
  export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Authentication failed') {
      super(message, 401);
    }
  }
  
  export class AuthorizationError extends ApplicationError {
    constructor(message: string = 'You are not authorized') {
      super(message, 403);
    }
  }