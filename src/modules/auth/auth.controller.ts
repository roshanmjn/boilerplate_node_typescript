// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import { authService } from "../../services";

// export const register = catchAsync(async (req, res) => {
//     const user = await authService.createUser(req.body);
//     return res.status(httpStatus.CREATED).send({ user });
// });

// export const login = catchAsync(async (req, res) => {
//     const { email, password } = req.body;
//     const deviceId = req.headers["device-id"] as string;
//     const user = await authService.login(email, password, deviceId);
//     res.cookie("access_token", user?.token, {
//         httpOnly: true,
//         maxAge: 120 * 60 * 60 * 1000, // 12 hours
//     });
//     res.cookie("refresh_token", user?.refreshToken, {
//         httpOnly: true,
//         maxAge: 70 * 24 * 60 * 60 * 1000, // 7 days
//     });
//     return res.json(user);
// });

// export const verifyLogin = catchAsync(async (req, res) => {
//     const accessToken = req.headers["x-access-token"] as string;
//     const deviceId = req.headers["device-id"] as string;
//     const user = await authService.verifyLogin(accessToken, deviceId);
//     return res.status(user.statusCode).json(user);
// });

// export const logout = catchAsync(async (req, res) => {
//     // const refreshToken = req.body.refreshToken;
//     const refreshToken = req.headers["x-refresh-token"] as string;
//     const deviceId = req.headers["device-id"] as string;
//     const user = await authService.logout(refreshToken);
//     if (user.message == "Logout successfully") {
//         res.clearCookie("access_token");
//         res.clearCookie("refresh_token");
//         return res.status(httpStatus.OK).send("Logout successfully");
//     } else {
//         return res.status(httpStatus.BAD_REQUEST).send({ user });
//     }
// });

// export const refreshTokens = catchAsync(async (req, res) => {
//     const deviceId = req.headers["device-id"] as string;
//     const tokens = await authService.refreshAuth(req.body.refreshToken);
//     res.send({ ...tokens });
// });
