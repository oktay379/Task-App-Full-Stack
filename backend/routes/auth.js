import exporess from "express";
import { register, login, logout, verify, verifyUser } from "../controllers/auth.js"



const router = exporess.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/verify", verifyUser, verify);





export default router;
