// import jwt from "jsonwebtoken";
// import httpStatus from "http-status";
// import { Request, Response, NextFunction } from "express";
// import { setSensitiveEmail } from "../utils/Logger/logUser";
// import { DB } from "../database/connection";
// import { customLogger } from "../utils/Logger";
// import { HttpException } from "../middlewares/errors";
// import { constant_table_name_id, constant_method_name_id } from "../utils/constants";
// import { RowDataPacket } from "mysql2";

// declare global {
//     namespace Express {
//         interface Request {
//             userId: number;
//             group_id: string;
//         }
//     }
// }
// /**
//  * Middleware function to that takes a table_name string then authenticate tokens and check permissions based on table_name and HTTP method.
//  * @param {string} table_name - The name of the table to check permissions for, which is converted into and id.
//  * @example
//  * table_name = "tournaments"; // Corresponds to table ID 1
//  * table_name = "rounds"; // Corresponds to table ID 2
//  * table_name = "matches"; // Corresponds to table ID 3
//  * table_name = "teams"; // Corresponds to table ID 4
//  * table_name = "players"; // Corresponds to table ID 5
//  * table_name = "live_scores"; // Corresponds to table ID 6
//  * table_name = "skip_role_check"; // Corresponds to table ID 69, skip role check.
//  * @returns {Function} Express middleware function.
//  */
// export function authenticateToken(table_name: string | null = null) {
//     // if (process.env.NODE_ENV === "development") {
//     //     return next();
//     // }

//     if (typeof table_name === "object") {
//         customLogger.error(
//             "authenticateToken",
//             // @ts-ignore
//             `Internal server error. No table_name sent on authenticateToken function to path = '${table_name?.baseUrl}'.`
//         );
//         throw new HttpException(500, "Internal server error.");
//     }

//     // @ts-ignore
//     const table_name_into_id = constant_table_name_id[table_name];

//     return function (req: Request, res: Response, next: NextFunction) {
//         if (!table_name_into_id || isNaN(table_name_into_id)) {
//             customLogger.error("authenticateToken", `Internal server error, no table id found for table_name = '${table_name}'.`);
//             throw new HttpException(500, "Internal server error, table id khai bhai?");
//         }

//         if (!req.headers["x-access-token"]) {
//             return res.status(401).json({
//                 status: "error",
//                 statusCode: httpStatus.UNAUTHORIZED,
//                 message: "Authentication failed: Token missing",
//             });
//         }
//         const token = req.headers["x-access-token"] as string;
//         const device_id = (req.headers["device-id"] as string) ?? "unknown";
//         const ipAddress = (req.headers["x-forwarded-for"] as string) ?? "localkera";

//         const group_id = req.group_id ?? req.headers["group-id"];

//         const convert_method_to_action: number = constant_method_name_id[req.method.toLowerCase()];

//         if (!convert_method_to_action) {
//             customLogger.error("authenticateToken", `Internal server error, no action id found for method = '${req.method.toLowerCase()}'.`);
//             return res.status(500).json({
//                 status: "error",
//                 statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//                 message: "Internal server error, action id khai bhai?",
//             });
//         }

//         jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, decoded: any) => {
//             if (err) {
//                 if (err.name === "JsonWebTokenError") {
//                     return res.status(401).json({
//                         status: "error",
//                         statusCode: httpStatus.UNAUTHORIZED,
//                         message: "Authentication failed: Invalid token",
//                     });
//                 } else if (err.name === "TokenExpiredError") {
//                     return res.status(401).json({
//                         status: "error",
//                         statusCode: httpStatus.UNAUTHORIZED,
//                         message: "Authentication failed: Token expired",
//                     });
//                 } else {
//                     return res.status(500).json({
//                         status: "error",
//                         statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//                         message: "Internal server error",
//                     });
//                 }
//             }
//             req.userId = decoded?.id;
//             const is_super_admin = decoded.is_super_admin || 0;

//             if (table_name_into_id !== 69) {
//                 if (is_super_admin === 1) {
//                     customLogger.info("authenticateToken", `Super admin access by ${decoded.email}. URL= ${req.originalUrl}`);

//                     const [checkSuperAdmin] = await DB.query<RowDataPacket[]>(`SELECT is_super_admin FROM users WHERE email = ?`, [decoded.email]);
//                     if (checkSuperAdmin.length > 0 && checkSuperAdmin[0].is_super_admin !== 1) {
//                         customLogger.warn("authenticateToken", `Unauthorized access attempt by ex-super-man = ${decoded.email}. URL= ${req.originalUrl}`);

//                         return res.status(401).json({
//                             status: false,
//                             statusCode: httpStatus.UNAUTHORIZED,
//                             is_super_admin: checkSuperAdmin[0].is_super_admin,
//                             message: "From Superman to man ~ ~",
//                         });
//                     }
//                 }
//                 if (is_super_admin !== 1) {
//                     const [result] = await DB.query<RowDataPacket[]>(`
//                         SELECT gur.table_id , guaat.table_name, gur.action_id , gua.actions
//                         FROM group_user_roles gur
//                         JOIN group_user_actions_apply_table guaat
//                         ON guaat.id = gur.table_id
//                         JOIN group_user_actions gua
//                         ON gua.id = gur.action_id
//                         WHERE gur.user_id =${decoded.id} AND gur.table_id = ${table_name_into_id} AND gur.group_id = ${group_id};`);

//                     const roles = result.filter((role) => role.action_id === convert_method_to_action);

//                     if (roles.length === 0) {
//                         customLogger.error("authenticateToken", `Unauthorized access attempt by ${decoded.email} , URL= ${req.originalUrl}`);
//                         return res.status(401).json({
//                             status: "error",
//                             statusCode: httpStatus.UNAUTHORIZED,
//                             message: "Authorization failed: You do not have permission to access this resource.",
//                         });
//                     }
//                 }
//             }
//             setSensitiveEmail("unknown", "unknown", "unknown");
//             next(setSensitiveEmail(decoded.email, device_id, ipAddress));
//         });
//     };
// }

// export function checkGroupId(req: Request, res: Response, next: NextFunction) {
//     customLogger.info("checkGroupId", `Group ID: ${req.headers["group-id"]}`);
//     if (!req.headers["group-id"]) {
//         const tempHeaders = { ...req.headers };
//         delete tempHeaders?.cookie;
//         if (tempHeaders["x-access-token"]) delete tempHeaders[`x-access-token`];
//         customLogger.error("checkGroupId", `Group ID missing in headers.`, [tempHeaders]);
//         return res.status(403).json({
//             status: "error",
//             statusCode: httpStatus.FORBIDDEN,
//             message: "Group ID missing",
//         });
//     }
//     req.group_id = req.headers["group-id"] as string;
//     delete req.headers["group-id"];
//     next();
// }
