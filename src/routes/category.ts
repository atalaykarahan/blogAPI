import express from "express";
import * as CategoryController from "../controller/category";
import {requiresAuth} from "../middleware/auth";
import multer from "multer";
import * as path from "node:path";
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

// create
router.post('/', requiresAuth, CategoryController.createCategory)

// get by id
router.get('/:id', requiresAuth, CategoryController.getCategoryById)

// update
router.put("/", requiresAuth, CategoryController.updateCategory);

//delete
// router.delete('/:id', requiresAuth, CategoryController.deleteFullCategory);

// get all
router.get('/', requiresAuth, CategoryController.getAll)

// get all by status
// router.get('/status/:status_id', requiresAuth, CategoryController.getAllByStatus)

export default router;