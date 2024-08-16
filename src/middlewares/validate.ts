import { ValidationError, parseValidationError, HttpException } from "../middlewares/errors";
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

const validateSchema = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.headers["device-id"]) req.body["device-id"] = req.headers["device-id"]; // this line is added to validate device_id in reset-password schema
        const { error, value } = schema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        });
        if (error) {
            throw error;
        }
        next();
    } catch (err: any) {
        if ("details" in err) {
            parseValidationError(req, res, err);
        } else {
            throw new HttpException(500, "Internal server error. " + err?.message);
        }
    }
};

type SchemaData = {
    [key: string]: any;
};

const validateSocketSchema = (data: SchemaData, schema: Schema) => {
    try {
        const { error, value } = schema.validate(data, {
            stripUnknown: true,
            abortEarly: false,
        });

        if (error) {
            throw error;
        }
        return {
            status: true,
            statusCode: 200,
            data: value,
        };
    } catch (error: any) {
        const errors: ValidationError[] = [];
        error.details?.forEach((each: ValidationError) => {
            errors.push({
                path: each.path,
                label: each?.context?.label,
                message: each.message,
            });
        });
        return {
            status: false,
            statusCode: 422,
            errors,
        };
    }
};

export { validateSchema, validateSocketSchema };
