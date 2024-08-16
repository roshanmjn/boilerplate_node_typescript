import express, { Request, Response, NextFunction } from "express";
import authRoute from "../modules/auth/auth.route";

const router = express.Router();

router.use("/", (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/v1");
    next();
});

router.use("/auth", authRoute);

export default router;
