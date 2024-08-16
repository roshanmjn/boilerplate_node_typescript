import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpException } from "../middlewares/errors";

const encrypt = async (data: any) => await bcrypt.hash(data.toString(), 10);

const decrypt = async (data: any, hash: any) => await bcrypt.compare(data.toString(), hash);

const decodeBase64Values = (arr: Array<any>) => {
    let decoded: any = {};
    for (let key in arr) {
        if (typeof arr[key] === "string" && isBase64(arr[key])) {
            decoded[key] = decodeURIComponent(atob(arr[key]));
        } else {
            decoded[key] = arr[key];
        }
    }
    return decoded;
};

function isBase64(str: string) {
    try {
        if (str.length < 5) return false;
        return decodeURIComponent(btoa(atob(str))) === decodeURIComponent(str);
    } catch (err) {
        return false;
    }
}

const jwtSign = (data: any) => {
    try {
        const options = { expiresIn: "1000m" };
        return jwt.sign(data, process.env.JWT_SECRET as string, options);
    } catch (error: any) {
        console.error("Error signing JWT:", error.message);
        throw new Error("Failed to sign JWT");
    }
};

const jwtRefreshSign = (data: any, expiresIn = "7d") => {
    try {
        const options = { expiresIn };
        return jwt.sign(data, process.env.JWT_SECRET_REFRESH as string, options);
    } catch (error: any) {
        console.error("Error signing refresh JWT:", error.message);
        throw new Error("Failed to sign refresh JWT");
    }
};

const jwtDecode = (token: string): jwt.JwtPayload => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
    } catch (error: any) {
        console.error("Error decoding JWT:", error.message);
        throw new HttpException(401, "Failed to decode JWT");
    }
};

const jwtRefreshDecode = (token: any) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_REFRESH as string);
    } catch (error: any) {
        console.error("Error decoding refresh JWT:", error.message);
        throw new Error("Failed to decode refresh JWT");
    }
};

const jwtSecretVerifySign = (data: any, expiresIn = "3d") => {
    try {
        const options = { expiresIn };
        return jwt.sign(data, process.env.JWT_SECRET_RESET_VERIFY as string, options);
    } catch (error: any) {
        console.error("Error Verification of Reset JWT:", error.message);
        throw new Error("Failed in Verification Reset JWT");
    }
};

const jwtResetVerifyDecode = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_RESET_VERIFY as string);
    } catch (error: any) {
        console.error("Error decoding reser JWT:", error.message);
        throw new Error("Failed to decode reset JWT");
    }
};

const hasTokenExpired = (expiryDate: any) => {
    const currentTimestamp = Date.now();
    return currentTimestamp >= Number(expiryDate);
};
export {
    encrypt,
    decrypt,
    decodeBase64Values,
    jwtSign,
    jwtRefreshSign,
    jwtRefreshDecode,
    jwtDecode,
    jwtSecretVerifySign,
    jwtResetVerifyDecode,
    hasTokenExpired,
};
