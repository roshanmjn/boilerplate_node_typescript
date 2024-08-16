import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "./errors";
import Logger from "../utils/Logger";
import "dotenv/config";

const errorHandler = (err: HttpException, _: Request, res: Response, _next: NextFunction) => {
    if (err && err.statusCode) {
        return res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            errors: Array.isArray(err.message) ? err.message : [{ message: err.message }],
        });
    }

    if (err && err instanceof jwt.JsonWebTokenError) {
        return res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            errors: Array.isArray(err.message) ? err.message : [{ message: err.message }],
        });
    }

    Logger.error(`Error: ${err.message}`);

    return res.status(500).json({
        status: "error",
        statusCode: 500,
        errors: [{ message: "Something went wrong!" }],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;
