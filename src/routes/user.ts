import express from "express";
import * as UserController from "../controller/user";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

//login
router.post("/login", UserController.login);

//logout
router.post("/logout", requiresAuth, UserController.logout);

//authorize
router.get('/', requiresAuth, UserController.authenticatedUser)


export default router;