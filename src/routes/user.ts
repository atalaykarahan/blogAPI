import express from "express";
import * as UserController from "../controller/user";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

//login
router.post("/login", UserController.login);

//authorize
router.get('/', requiresAuth, UserController.authenticatedUser)


export default router;