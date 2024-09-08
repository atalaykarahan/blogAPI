import createHttpError from "http-errors";
import db from "../../db";
import {fileService} from "./file";
import CategoryModel from "../models/category";


class CategoryService {
    //#region CREATE CATEGORY
    async create(name: string) {
        const t = await db.transaction();
        try {
            const createdCategory = await CategoryModel.create({
                category_name: name,
            });
            return createdCategory;
        } catch (error) {
            console.error('Category insert error; ', error);
            throw createHttpError(500, "Category insert error");
        }
    }

    //#endregion

    //#region GET CATEGORY BY ID WITH PROP
    async findOneById(id: string) {
        try {
            const category = await CategoryModel.findByPk(id);
            if (!category)
                throw createHttpError(404, "Category not found");

            return category;
        } catch (error) {
            console.error('Database error during category search: ', error);
            throw createHttpError(500, "An error occurred while searching for the category. Please try again later.");
        }
    }

    //#endregion


    //#region UPDATE CATEGORY
    async updateCategory(id: string, name: string) {
        try {
            const oldCategory = await CategoryModel.findByPk(id);
            if (!oldCategory)
                throw createHttpError(404, "Category not found");

            oldCategory.category_name = name;
            await oldCategory.save();

            return oldCategory;
        } catch (error) {
            console.error('Category update error; ', error);
            throw createHttpError(500, "Category update error");
        }
    }

    //#endregion


    //#region DELETE CATEGORY
    async deleteCategory(id: string) {
        try {
            const category = await CategoryModel.findByPk(id);

            if (!category)
                throw createHttpError(404, "Category not found");

            // Category'u sil
            await category.destroy();
            return true;
        } catch (error) {
            console.error('Category delete error; ', error);
            throw createHttpError(500, "An error occurred while deleting the category.");
        }
    }

    //#endregion

    //#region GET FULL ALL CATEGORY WITH PROP
    async getAll() {
        try {
            const category = await CategoryModel.findAll();
            if (!category)
                throw createHttpError(404, "Category not found");
            return category;
        } catch (error) {
            console.error('Database error during get all category: ', error);
            throw createHttpError(500, "An error occurred while get all for the category. Please try again later.");
        }
    }

    //#endregion

    // //#region GET CATEGORY BY STATUS WITH PROP
    // async getAllByStatus(status_id: string) {
    //     try {
    //         const category = await CategoryModel.findAll({
    //             include: [
    //                 {
    //                     model: CategoryModel,
    //                     as: 'categories', // Belirtilen alias ismi
    //                     attributes: ['category_id', 'category_name'], // Getirmek istediğiniz alanlar
    //                     through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
    //                 },
    //                 {
    //                     model: TagModel,
    //                     as: 'tags', // Belirtilen alias ismi
    //                     attributes: ['tag_id', 'tag_name'], // Getirmek istediğiniz alanlar
    //                     through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
    //                 }
    //             ],
    //             where: {status_id: status_id}
    //         });
    //         if (!category)
    //             throw createHttpError(404, "Category not found");
    //
    //         return category;
    //     } catch (error) {
    //         console.error('Database error during get all category: ', error);
    //         throw createHttpError(500, "An error occurred while get all for the category. Please try again later.");
    //     }
    // }
    //
    //
    // //#endregion

}

export const categoryService = new CategoryService();