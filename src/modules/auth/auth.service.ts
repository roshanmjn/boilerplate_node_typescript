import { customLogger } from "../../utils/Logger/index";
import httpStatus from "http-status";
import { HttpException } from "../../middlewares/errors";
import { DB } from "../../database/connection";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { DiscordAuthResponse, UserData } from "./auth.types";
import { RowDataPacket, FieldPacket, ResultSetHeader } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { encrypt, decrypt, jwtSign, jwtRefreshSign, jwtRefreshDecode, jwtDecode, jwtSecretVerifySign, jwtResetVerifyDecode } from "../../utils/encrypter";

export async function createUser(userBody: UserData) {
    try {
        const { first_name, last_name, email, password, confirm_password, image, is_admin = false } = userBody;

        const conn = await DB;
        let query = "SELECT * FROM users WHERE email = ?";
        const [findUser] = await conn.query<RowDataPacket[]>(query, [email]);
        customLogger.info("createUser", `Find user with email: ${email}`);

        if (findUser && findUser.length > 0) {
            customLogger.error("createUser", `Find user with email '${email}' already exists!`);
            throw new HttpException(httpStatus.CONFLICT, "User account already exists!");
        }
        if (password !== confirm_password) {
            customLogger.error("createUser", `Failed to create '${email}' as passwords do not match!`);
            throw new HttpException(httpStatus.BAD_REQUEST, "Passwords do not match!");
        }

        const verificationToken = uuidv4();
        const hashed_password = await encrypt(password);
        const image_path = image || null;
        customLogger.info("createUser", `Creating account for email '${email}'`);
        const queryy = `INSERT INTO users
            (first_name, last_name, email, password,image, token, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())`;

        const [user] = await conn.query(queryy, [first_name, last_name, email, hashed_password, image_path, verificationToken, is_admin]);
        customLogger.info("createUser", `Creating account successful!`);
        return {
            status: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully and a verification link has been sent to your email!",
        };
    } catch (error: any) {
        customLogger.error("createUser", `Error creating user: ${error}`);
        throw new HttpException(httpStatus.BAD_REQUEST, error?.message);
    }
}

export async function login(email: string, password: string, deviceId: string) {
    let connection: PoolConnection | null = null;
    try {
        connection = await DB.getConnection();

        if (!connection) {
            customLogger.error("login", "Failed to connect to database.");
            return { status: false, statusCode: httpStatus.BAD_REQUEST, message: "Failed to connect to database." };
        }

        await connection.beginTransaction();
        /** Check if user exist with email exist in DB,
         * and if user exist then also check the groups in which user has joined  */
        const query = `
            SELECT u.id, u.first_name , u.last_name , u.email , u.password , u.image ,u.is_admin, u.is_super_admin , u.status,
            WHERE u.email = ?;`;

        const [findUser] = await connection.query<RowDataPacket[]>(query, [email]);

        if (!findUser || findUser.length < 1) {
            customLogger.error("login", `User account does not exist. Email: '${email}'`);
            return {
                status: false,
                statusCode: httpStatus.NOT_FOUND,
                message: "User account does not exist!",
            };
        }

        const decoded = {
            id: findUser[0].id,
            first_name: findUser[0].first_name,
            last_name: findUser[0].last_name,
            email: findUser[0].email,
            is_admin: findUser[0].is_admin,
            is_super_admin: findUser[0].is_super_admin,
        };

        const decoded_password = await decrypt(password, findUser[0].password);

        if (!decoded_password) {
            customLogger.error("login", `Invalid password entered for email: '${email}'`);
            return {
                status: "error",
                statusCode: httpStatus.BAD_REQUEST,
                message: "Invalid email or Password!",
            };
        }

        const refreshToken = jwtRefreshSign(decoded);

        customLogger.info("login", `Generated refresh token. Checking if session exists for: '${email}'`);

        const checkSessionsQuery = `
            SELECT user_id, refresh_token 
            FROM user_session 
            WHERE user_id = ?`;
        const [checkSessionsResult] = await connection.query<RowDataPacket[]>(checkSessionsQuery, [decoded.id]);

        let finalResult;
        if (checkSessionsResult.length === 0) {
            /** Create new session */
            const insertSessionQuery = `
                INSERT INTO user_session (user_id, refresh_token,created_at,updated_at)
                VALUES (?, ?, NOW(), NOW() );`;
            const [insertSessionResult] = await connection.query<ResultSetHeader>(insertSessionQuery, [decoded.id, refreshToken]);

            if (insertSessionResult.affectedRows !== 1) {
                customLogger.error("login", `Failed to insert user and create session for: '${email}' and id=${decoded.id}`);
                await connection.rollback();
                return {
                    status: "error",
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Failed to create session.",
                };
            }
            /** Save device id in 'users' table */
            const insertDeviceIdQuery = `UPDATE users SET token = ? WHERE id = ?;`;
            const [insertDeviceIdResult] = await connection.query<ResultSetHeader>(insertDeviceIdQuery, [deviceId, decoded.id]);

            if (insertDeviceIdResult.affectedRows !== 1) {
                customLogger.error("login", `Failed to save the device id for: '${email}' and id=${decoded.id}`);
                await connection.rollback();
                return {
                    status: "error",
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Failed to save the device id.",
                };
            }
            finalResult = insertSessionResult;
        } else {
            customLogger.warn(
                "login",
                `Replacing refresh token & device_id for user acc which already logged in from another device. Email= '${email}' and id=${decoded.id}`
            );

            /** Update refresh token */
            const insertSessionQuery = `UPDATE user_session set refresh_token = ?, updated_at = NOW() WHERE user_id = ?`;
            const [insertSessionResult] = await connection.query<ResultSetHeader>(insertSessionQuery, [refreshToken, decoded.id]);

            if (insertSessionResult.affectedRows !== 1) {
                customLogger.error("login", `Failed to update refresh token for: '${email}' and id=${decoded.id}`);
                await connection.rollback();
                return {
                    status: "error",
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Failed to update refresh token.",
                };
            }
            /** Save device id in 'users' table */
            const insertDeviceIdQuery = `UPDATE users SET token = ? WHERE id = ?;`;
            const [insertDeviceIdResult] = await connection.query<ResultSetHeader>(insertDeviceIdQuery, [deviceId, decoded.id]);

            if (insertDeviceIdResult.affectedRows !== 1) {
                customLogger.error("login", `Failed to save the device id for: '${email}' and id=${decoded.id}`);
                await connection.rollback();
                return {
                    status: "error",
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Failed to save the device id.",
                };
            }

            finalResult = insertSessionResult;
        }

        if (finalResult.affectedRows !== 1) {
            customLogger.error("login", `Failed to save the refresh token & dev_id for: '${email}'`);
            return {
                status: "error",
                statusCode: httpStatus.BAD_REQUEST,
                message: "Failed to save the refresh token & dev_id.",
            };
        }

        customLogger.info("login", `Generated access token for: '${email}'`);

        const accessToken = jwtSign(decoded);

        await connection.commit();

        return {
            id: decoded.id,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
            image: findUser[0].image,
            token: accessToken,
            refreshToken: refreshToken,
            is_super_admin: decoded.is_super_admin,
            is_admin: decoded.is_admin,
            groups: findUser[0]?.groups?.length > 0 ? JSON.parse(findUser[0].groups) : [],
        };
    } catch (error) {
        if (connection) await connection.rollback();

        customLogger.error("login", `Error on user Login: ${error}`);

        throw new HttpException(httpStatus.BAD_REQUEST, "Failed to login & save the refresh token.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export async function verifyLogin(accessToken: string, deviceId: string) {
    try {
        const decoded: any = jwtDecode(accessToken);
        const getDeviceIdQuery = `SELECT token FROM users WHERE id = ?`;
        const [checkResult] = await DB.query<RowDataPacket[]>(getDeviceIdQuery, [decoded.id]);

        if (checkResult.length > 0 && checkResult[0].token === String(deviceId)) {
            customLogger.info("verifyLogin", `Login verified for '${decoded.email}'`);
            return {
                status: true,
                statusCode: httpStatus.OK,
                message: "User verified successfully",
            };
        }

        customLogger.error("verifyLogin", `Login verification failed for '${decoded.email}'`);
        return {
            status: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Verification failed. Please login again!",
        };
    } catch (error) {
        customLogger.error("verifyLogin", `User verification failed: ${error}`);
        throw new HttpException(httpStatus.UNAUTHORIZED, "Verification failed. Please login again.");
    }
}

export async function refreshAuth(refreshToken: string) {
    try {
        customLogger.info("refreshAuth", `Received refresh token`);

        if (!refreshToken) {
            customLogger.error("refreshAuth", `Refresh token not received`);
            return {
                status: false,
                statusCode: httpStatus.UNAUTHORIZED,
                message: "Refresh token not found, login again",
            };
        }

        const conn = await DB;
        // @ts-ignore
        const user_id = jwtRefreshDecode(refreshToken).id;

        customLogger.info("refreshAuth", `Checking if refresh token exists for user_id:${user_id}`);

        let query = `
            SELECT us.user_id, u.first_name, u.last_name, u.email,
            us.refresh_token
            FROM user_session us 
            JOIN users u 
            ON us.user_id = u.id
            WHERE us.refresh_token = ? AND us.user_id = ?;`;

        const [findUser] = await conn.query<RowDataPacket[]>(query, [refreshToken, user_id]);

        if (findUser.length === 0) {
            customLogger.error("refreshAuth", `Invalid refresh token`);
            return {
                status: false,
                statusCode: httpStatus.UNAUTHORIZED,
                message: "Invalid refresh token",
            };
        }

        const decoded = {
            id: findUser[0].user_id,
            first_name: findUser[0].first_name,
            last_name: findUser[0].last_name,
            email: findUser[0].email,
        };

        const jwtConfig = {
            id: decoded.id,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
        };

        const newAccessToken = jwtSign(jwtConfig);

        customLogger.info("refreshAuth", `Generated and sent new access token`);
        return {
            id: decoded.id,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
            token: newAccessToken,
            refreshToken: refreshToken,
        };
    } catch (error) {
        customLogger.error("refreshAuth", `Error during refreshAuth: ${error}`);
        throw new HttpException(httpStatus.BAD_REQUEST, "Failed to refresh authentication.");
    }
}

export async function logout(refreshToken: string) {
    try {
        if (!refreshToken) {
            customLogger.error("logout", `Refresh token not received`);
            return {
                status: "error",
                statusCode: 401,
                message: "Refresh token not found, login again",
            };
        }

        const conn = await DB;
        // @ts-ignore
        const userId = jwtRefreshDecode(refreshToken).id;

        customLogger.info("logout", `Checking if refresh token exists in DB`);

        let query = "SELECT * FROM user_session WHERE refresh_token = ? AND user_id=?";
        const [findUser] = await conn.query<RowDataPacket[]>(query, [refreshToken, userId]);
        if (findUser.length === 0) {
            customLogger.info("logout", `No session found in DB to logout`);
            return {
                status: "error",
                statusCode: 401,
                message: "Invalid refresh token",
            };
        }

        customLogger;
        const verifyTokenSignature = jwtRefreshDecode(refreshToken);
        if (!verifyTokenSignature) {
            customLogger.error("logout", `Invalid refresh token`);
            return {
                status: false,
                statusCode: 404,
                message: "Invalid refresh token",
            };
        }

        customLogger.info("logout", `Clearing session`);
        const deleteQuery = "DELETE FROM user_session WHERE refresh_token = ? AND user_id = ?";
        const [deleteResult] = await conn.query<ResultSetHeader>(deleteQuery, [refreshToken, userId]);

        if (deleteResult.affectedRows !== 1) {
            customLogger.error("logout", `Failed to logout. Failed to delete the refresh token.`);
            return {
                status: "error",
                statusCode: 401,
                message: "Failed to logout. Failed to delete the refresh token.",
            };
        }

        customLogger.info("logout", `Logout success`);
        return { status: true, statusCode: 204, message: "Logout successfully" };
    } catch (error) {
        customLogger.error("logout", `Error during logout: ${error}`);
        throw new HttpException(httpStatus.BAD_REQUEST, "Failed to refresh authentication.");
    }
}
