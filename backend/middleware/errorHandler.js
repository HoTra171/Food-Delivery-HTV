// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Default to 500 server error
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = "Token expired";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Custom error class for easier error throwing
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export { errorHandler, AppError };
