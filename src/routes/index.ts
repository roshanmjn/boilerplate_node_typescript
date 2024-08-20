import express, { Request, Response, NextFunction } from "express";
// import authRoute from "../modules/auth/auth.route";
import playerRoute from "../modules/player";

const router = express.Router();

router.use("/", (req: Request, res: Response, next: NextFunction) => {
    // console.log("/api/v1");
    next();
});

// router.use("/auth", authRoute);
router.use("/player", playerRoute);

export default router;
