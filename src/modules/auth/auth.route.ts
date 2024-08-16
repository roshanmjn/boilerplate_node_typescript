import express, { Request, Response, NextFunction, Router } from "express";
import { validateSchema } from "../../middlewares/validate";
import * as authValidation from "../../validations/auth.validation";
import { authController } from "../../controllers";
import { authenticateToken } from "../../middlewares/auth.verify";

const router: Router = express.Router();

router.use("/", (req: Request, res: Response, next: NextFunction) => {
    console.log("/auth");
    next();
});

//AUTH ROUTES
router.post("/register", validateSchema(authValidation.register), authController.register);
router.post("/login", validateSchema(authValidation.login), authController.login);
router.get("/verify-login", authController.verifyLogin);
router.post("/refreshtoken", validateSchema(authValidation.refreshTokens), authController.refreshTokens);
router.get("/logout", authenticateToken("skip_role_check"), authController.logout);

export default router;
