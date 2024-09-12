import createHttpError from "http-errors";
import db from "../../db";
import TagModel from "../models/tag";


class TagService {
    //#region CREATE TAG
    async create(name: string) {
        const t = await db.transaction();
        try {
            const createdTag = await TagModel.create({
                tag_name: name,
            });
            return createdTag;
        } catch (error) {
            console.error('Tag insert error; ', error);
            throw createHttpError(500, "Tag insert error");
        }
    }

    //#endregion

    //#region GET TAG BY ID WITH PROP
    async findOneById(id: string) {
        try {
            const tag = await TagModel.findByPk(id);
            if (!tag)
                throw createHttpError(404, "Tag not found");

            return tag;
        } catch (error) {
            console.error('Database error during tag search: ', error);
            throw createHttpError(500, "An error occurred while searching for the tag. Please try again later.");
        }
    }

    //#endregion


    //#region UPDATE TAG
    async updateTag(id: string, name: string) {
        try {
            const oldTag = await TagModel.findByPk(id);
            if (!oldTag)
                throw createHttpError(404, "Tag not found");

            oldTag.tag_name = name;
            await oldTag.save();
            return oldTag;
        } catch (error) {
            console.error('Tag update error; ', error);
            throw createHttpError(500, "Tag update error");
        }
    }

    //#endregion


    //#region DELETE TAG
    async deleteTag(id: string) {
        try {
            const tag = await TagModel.findByPk(id);

            if (!tag)
                throw createHttpError(404, "Tag not found");

            // Tag'u sil
            await tag.destroy();
            return true;
        } catch (error) {
            console.error('Tag delete error; ', error);
            throw createHttpError(500, "An error occurred while deleting the tag.");
        }
    }

    //#endregion

    //#region GET FULL ALL TAG WITH PROP
    async getAll() {
        try {
            const tag = await TagModel.findAll();
            if (!tag)
                throw createHttpError(404, "Tag not found");
            return tag;
        } catch (error) {
            console.error('Database error during get all tag: ', error);
            throw createHttpError(500, "An error occurred while get all for the tag. Please try again later.");
        }
    }

    //#endregion

}

export const tagService = new TagService();