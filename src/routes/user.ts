import express from "express";
import * as UserController from "../controller/user";

const router = express.Router();

//login
router.post("/login", UserController.login);

//authorize
router.get('/', UserController.authenticatedUser)


export default router;