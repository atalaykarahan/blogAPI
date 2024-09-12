import express from "express";
import * as TagController from "../controller/tag";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

// create
router.post('/', requiresAuth, TagController.createTag)

// get by id
router.get('/:id', requiresAuth, TagController.getTagById)

// update
router.put("/", requiresAuth, TagController.updateTag);

//delete
router.delete('/:id', requiresAuth, TagController.deleteTag);

// get all
router.get('/', TagController.getAll)

export default router;