import express from "express";
import * as CategoryController from "../controller/category";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

// create
router.post('/', requiresAuth, CategoryController.createCategory)

// get by id
router.get('/:id', requiresAuth, CategoryController.getCategoryById)

// update
router.put("/", requiresAuth, CategoryController.updateCategory);

//delete
router.delete('/:id', requiresAuth, CategoryController.deleteCategory);

// get all
router.get('/', CategoryController.getAll)

export default router;