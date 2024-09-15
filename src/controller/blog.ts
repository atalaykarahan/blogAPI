import {RequestHandler} from "express";
import createHttpError from "http-errors";
import {blogService} from "../services/blog";
import {fileService} from "../services/file";
import env from "../util/validateEnv"

//#region CREATE BLOG
export interface CreateBlogBody {
    title?: string;
    slug?: string;
    description?: string;
    status?: string; //bigint bir tur olmali
}

export const createBlog: RequestHandler<
    unknown,
    unknown,
    CreateBlogBody,
    unknown
> = async (req, res, next) => {
    const title = req.body.title;
    const slug = req.body.slug;
    const description = req.body.description;
    const status = req.body.status;

    try {
        if (!title || !slug || !description || !status) {
            throw createHttpError(400, "Missing parameters");
        }

        const newBlog = await blogService.create(title, slug, description, status);
        res.status(201).json(newBlog);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region GET BLOG BY ID
export const getBlogById: RequestHandler = async (req, res, next) => {
    const book_id = req.params.id;
    try {
        if (!book_id) {
            throw createHttpError(400, "Missing parameters");
        }

        const blog = await blogService.findOneById(book_id);
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region UPDATE BLOG
export interface UpdateBlogBody {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    status?: string; //bigint bir tur olmali
}

export const updateBlog: RequestHandler<
    unknown,
    unknown,
    UpdateBlogBody,
    unknown
> = async (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const slug = req.body.slug;
    const description = req.body.description;
    const status = req.body.status;

    try {
        if (!id || !title || !slug || !description || !status) {
            throw createHttpError(400, "Missing parameters");
        }

        const updatedBlog = await blogService.updateBlog(id, title, slug, description, status);
        res.status(201).json(updatedBlog);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region DELETE FULL BLOG
export const deleteFullBlog: RequestHandler = async (req, res, next) => {
    const blog_id = req.params.id;
    try {
        if (!blog_id) {
            throw createHttpError(400, "Missing parameters");
        }
        const deletedBlog = await blogService.deleteFullBlog(blog_id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}
//#endregion

//#region GET ALL
export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const blog = await blogService.getAll();
        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region GET ALL BY STATUS
export const getAllByStatus: RequestHandler = async (req, res, next) => {
    const status_id = req.params.status_id;
    try {
        const blog = await blogService.getAllByStatus(status_id);
        ;
        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};
//#endregion

//#region INSERT FILE
export const insertFile: RequestHandler = async (req, res, next) => {

    if (!req.file || !req.fileUUID)
        throw createHttpError(400, "Missing file");

    try {
        console.log(req.file);
        console.log(req.fileUUID)
        const fileUrl = `${env.IMAGE_BASE_URL}/uploads/${req.file.filename}`;
        const file = await fileService.create(req.fileUUID, req.file.filename, fileUrl, req.file.mimetype, req.file.size);
        res.status(201).json(file.file_url);
    } catch (error) {
        next(error);
    }
}

//#endregion