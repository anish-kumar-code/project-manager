import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../controllers/user.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current-user").get(authentication, getCurrentUser);
router.route("/logout").post(authentication, logoutUser);




export default router;