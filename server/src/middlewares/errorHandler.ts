import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const errorHandler = (err: any,
  _req: Request,
  res: Response,
  _next: NextFunction): void => {
  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    // Extract only error messages from validation errors
    const validationMessages = Object.values(err.errors).map(
      (error: any) => error.message
    );

    res.status(400).json({
      success: false,
      statusCode: 400,
      message: validationMessages.join(", "),
      errors: validationMessages,
    });
  } else if (err instanceof ApiError) {
    // Check if the error is an instance of ApiError
    res.status(err.statusCode || 500).json({
      success: err.statusCode < 400 ? true : false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  } else if (err.code === 11000 || err.code === 11001) {
    const field = Object.keys(err.keyPattern)[0];
    const duplicateValue = err.keyValue[field];

    res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Duplicate ${field} detected: ${duplicateValue}`,
      errors: [
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists!`,
      ],
    });
  } else {
    // Handle other errors not thrown with ApiError
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errors: [err.message],
    });
  }
};

export default errorHandler;