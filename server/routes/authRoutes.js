import express from 'express'
import { forgotPassword, getUser, loginUser, registerUser, resetPassword, updateUser } from '../controllers/authController.js';
import upload from '../middlewares/multerMiddleware.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/password/forgot-password", forgotPassword);
authRouter.put("/password/reset-password/:token", resetPassword);
authRouter.get("/profile", isAuthenticated, getUser);
authRouter.put("/update-user", isAuthenticated, upload.single("avatar"), updateUser);

export default authRouter;