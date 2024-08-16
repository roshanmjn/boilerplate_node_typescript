import { Request, Response } from "express";

export interface ValidationError {
    path: (string | number);
    context?: {
        label: string;
    };
    message: string;
    label?: string;
}
class HttpException extends Error {
    statusCode: number;
    status: string;
    errors: string | ValidationError[];

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = "error";
        this.errors = message;
    }
}

class NotFound extends HttpException {
    constructor(message = "Not Found!") {
        super(404, message);
    }
}
class NotAuthorized extends HttpException {
    constructor() {
        super(401, "Unauthorized access!");
    }
}
const parseValidationError = (
    req: Request,
    res: Response,
    err: { details?: ValidationError[] }
) => {
    const errors: ValidationError[] = [];

    err.details?.forEach((error) => {
        errors.push({
            path: error.path,
            message: error.message,
            label: error?.context?.label,
        });
    });

    return res
        .status(422)
        .json({ status: "error", statusCode: 422, errors: errors });
};

export { HttpException, NotFound, NotAuthorized, parseValidationError };
