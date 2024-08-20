import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "./errors";
import { Logger } from "../utils/Logger";
import "dotenv/config";
import {
    AggregateError,
    AssociationError,
    BaseError,
    BulkRecordError,
    ConnectionError,
    DatabaseError,
    EagerLoadingError,
    EmptyResultError,
    InstanceError,
    OptimisticLockError,
    QueryError,
    SequelizeScopeError,
    ValidationError,
    ValidationErrorItem,
    ValidationErrorItemOrigin,
    ValidationErrorItemType,
    AccessDeniedError,
    ConnectionAcquireTimeoutError,
    ConnectionRefusedError,
    ConnectionTimedOutError,
    HostNotFoundError,
    HostNotReachableError,
    InvalidConnectionError,
    ExclusionConstraintError,
    ForeignKeyConstraintError,
    TimeoutError,
    UnknownConstraintError,
    UniqueConstraintError,
} from "sequelize";

const errorHandler = (err: HttpException, _: Request, res: Response, _next: NextFunction) => {
    if (err && err.statusCode) {
        return res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            errors: Array.isArray(err.message) ? err.message : [{ message: err.message }],
        });
    }
    if (err && isSequelizeError(err)) {
        Logger.error(err.name, `${err.message}`);
        throw new HttpException(500, "Something went wrong!");
    }

    if (err && err instanceof jwt.JsonWebTokenError) {
        return res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            errors: Array.isArray(err.message) ? err.message : [{ message: err.message }],
        });
    }

    console.error(err.message);
    Logger.error("error", `${err.message}`);

    return res.status(500).json({
        status: "error",
        statusCode: 500,
        errors: [{ message: "Something went wrong!" }],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

function isSequelizeError(error: any) {
    const errorClasses = [
        AggregateError,
        AssociationError,
        BaseError,
        BulkRecordError,
        ConnectionError,
        DatabaseError,
        EagerLoadingError,
        EmptyResultError,
        InstanceError,
        OptimisticLockError,
        QueryError,
        SequelizeScopeError,
        ValidationError,
        ValidationErrorItem,
        ValidationErrorItemOrigin,
        ValidationErrorItemType,
        AccessDeniedError,
        ConnectionAcquireTimeoutError,
        ConnectionRefusedError,
        ConnectionTimedOutError,
        HostNotFoundError,
        HostNotReachableError,
        InvalidConnectionError,
        ExclusionConstraintError,
        ForeignKeyConstraintError,
        TimeoutError,
        UnknownConstraintError,
        UniqueConstraintError,
    ];
    return errorClasses.some((errorClass: any) => error && error instanceof errorClass);
}

export default errorHandler;
