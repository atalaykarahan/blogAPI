import {RequestHandler} from "express";
import createHttpError from "http-errors";
import {tagService} from "../services/tag";

//#region CREATE TAG
export interface CreateTagBody {
    name?: string;
}

export const createTag: RequestHandler<
    unknown,
    unknown,
    CreateTagBody,
    unknown
> = async (req, res, next) => {
    const name = req.body.name;

    try {
        if (!name) {
            throw createHttpError(400, "Missing parameters");
        }

        const newTag = await tagService.create(name);
        res.status(201).json(newTag);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region GET TAG BY ID
export const getTagById: RequestHandler = async (req, res, next) => {
    const tag_id = req.params.id;
    try {
        if (!tag_id) {
            throw createHttpError(400, "Missing parameters");
        }

        const tag = await tagService.findOneById(tag_id);
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region UPDATE TAG
export interface UpdateTagBody {
    id?: string;
    name?: string;
}

export const updateTag: RequestHandler<
    unknown,
    unknown,
    UpdateTagBody,
    unknown
> = async (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;

    try {
        if (!id || !name) {
            throw createHttpError(400, "Missing parameters");
        }

        const updatedTag = await tagService.updateTag(id, name);
        res.status(201).json(updatedTag);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region DELETE TAG
export const deleteTag: RequestHandler = async (req, res, next) => {
    const tag_id = req.params.id;
    try {
        if (!tag_id) {
            throw createHttpError(400, "Missing parameters");
        }
        const deletedTag = await tagService.deleteTag(tag_id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}
//#endregion

//#region GET ALL
export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const tag = await tagService.getAll();
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};
//#endregion

// //#region GET ALL BY STATUS
// export const getAllByStatus: RequestHandler = async (req, res, next) => {
//     const status_id = req.params.status_id;
//     try {
//         const tag = await tagService.getAllByStatus(status_id);
//         ;
//         res.status(201).json(tag);
//     } catch (error) {
//         next(error);
//     }
// };
// //#endregion
//
