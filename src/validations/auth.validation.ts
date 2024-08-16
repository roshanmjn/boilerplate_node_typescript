import Joi from "joi";
import { password } from "./custom.validation";

const register = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirm_password: Joi.string().valid(Joi.ref("password")).required().custom(password),
});

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const refreshTokens = Joi.object({
    refreshToken: Joi.string().required(),
});

const forgotPassword = Joi.object({
    email: Joi.string().email().required(),
});

const forgotResetPassword = Joi.object({
    newpassword: Joi.string().required().custom(password),
});
const resetPassword = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required().custom(password),
    "device-id": Joi.string().required().messages({ "any.required": "'device-id' required in header" }),
});

const verifyEmail = Joi.object({
    token: Joi.string().required(),
});

export { register, login, refreshTokens, forgotPassword, forgotResetPassword, verifyEmail, resetPassword };
