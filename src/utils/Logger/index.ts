import * as winston from "winston";
import moment from "moment-timezone";
import DailyRotateFile from "winston-daily-rotate-file";
import "dotenv/config";
import { getSensitiveEmail, getHttpMethod } from "./logUser";

/**
 * Logger modes:
 * info -
 * warn -
 * error -
 */

const timezone = moment.tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss");
const format = winston.format.combine(
    winston.format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    winston.format.align(),
    winston.format.colorize(),
    winston.format.errors({ stack: true }),
    winston.format.prettyPrint(),
    winston.format.simple(),
    winston.format.splat(),
    winston.format.timestamp({ format: timezone }),
    winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}] [${getHttpMethod().http_method === "unknown" ? "SOCKET" : getHttpMethod().http_method}]: ${
                meta?.functionName
            } - ${message?.trim()} ${meta?.context ? JSON.stringify(meta.context) : ""}`
    )
);

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({ format }),
        new DailyRotateFile({
            filename: "logs/%DATE%.log",
            zippedArchive: false,
            format: winston.format.combine(
                winston.format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
                winston.format.errors({ stack: true }),
                winston.format.timestamp({ format: () => moment.tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss") }),
                winston.format.printf(
                    ({ timestamp, level, message, ...meta }) =>
                        `{"timestamp":"${timestamp}","level":"${level}","method":"${
                            getHttpMethod().http_method === "unknown" ? "SOCKET" : getHttpMethod().http_method
                        },"function_name":${meta?.functionName},"message":"${message}","context": {"details":${
                            JSON.stringify(meta?.context) || "{}"
                        },"session":"${getSensitiveEmail().email}","device_id":"${getSensitiveEmail().device_id}","ip":"${getSensitiveEmail().ip}"}},`
                )
            ),
        }),
    ],
});

export const Logger = {
    info: (functionName: string, message: string, context?: any[]) => {
        logger.info(`${message}`, { functionName, context });
    },
    warn: (functionName: string, message: string, context?: any[]) => {
        logger.warn(`${message}`, { functionName, context });
    },
    error: (functionName: string, message: string, context?: any[]) => {
        logger.error(`${message}`, { functionName, context });
    },
};

export default logger;
