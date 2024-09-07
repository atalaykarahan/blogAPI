import {RequestHandler} from "express";
import createHttpError from "http-errors";
import {categoryService} from "../services/category";
import {fileService} from "../services/file";
import env from "../util/validateEnv"

//#region CREATE CATEGORY
export interface CreateCategoryBody {
    name?: string;
}

export const createCategory: RequestHandler<
    unknown,
    unknown,
    CreateCategoryBody,
    unknown
> = async (req, res, next) => {
    const name = req.body.name;

    try {
        if (!name) {
            throw createHttpError(400, "Missing parameters");
        }

        const newCategory = await categoryService.create(name);
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region GET CATEGORY BY ID
export const getCategoryById: RequestHandler = async (req, res, next) => {
    const category_id = req.params.id;
    try {
        if (!category_id) {
            throw createHttpError(400, "Missing parameters");
        }

        const category = await categoryService.findOneById(category_id);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region UPDATE CATEGORY
export interface UpdateCategoryBody {
    id?: string;
    name?: string;
}

export const updateCategory: RequestHandler<
    unknown,
    unknown,
    UpdateCategoryBody,
    unknown
> = async (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;

    try {
        if (!id || !name) {
            throw createHttpError(400, "Missing parameters");
        }

        const updatedCategory = await categoryService.updateCategory(id, name);
        res.status(201).json(updatedCategory);
    } catch (error) {
        next(error);
    }
};
//#endregion
//
// //#region DELETE FULL CATEGORY
// export const deleteFullCategory: RequestHandler = async (req, res, next) => {
//     const category_id = req.params.id;
//     try {
//         if (!category_id) {
//             throw createHttpError(400, "Missing parameters");
//         }
//         const deletedCategory = await categoryService.deleteFullCategory(category_id);
//         res.sendStatus(204);
//     } catch (error) {
//         next(error);
//     }
// }
// //#endregion

//#region GET ALL
export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const category = await categoryService.getAll();
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};
//#endregion

// //#region GET ALL BY STATUS
// export const getAllByStatus: RequestHandler = async (req, res, next) => {
//     const status_id = req.params.status_id;
//     try {
//         const category = await categoryService.getAllByStatus(status_id);
//         ;
//         res.status(201).json(category);
//     } catch (error) {
//         next(error);
//     }
// };
// //#endregion
//
