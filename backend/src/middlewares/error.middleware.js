

import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (!(err instanceof ApiError)) {
        console.error(err);

        if (process.env.NODE_ENV === 'production') {
            message = "Something went very wrong!";
        } else {
            message = err.message;
        }
    }

    // Construct the JSON response
    const response = {
        statusCode,
        message,
        success: false,
        errors: err.errors || [],
        data: null
    };

    return res.status(statusCode).json(response);
};

export { errorHandler };