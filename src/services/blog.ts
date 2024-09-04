import createHttpError from "http-errors";
import db from "../../db";
import BlogTagModel from "../models/blog_tag";
import {BlogCategoryModel, BlogModel, CategoryModel, TagModel} from "../models/associations";
import {fileService} from "./file";


class BlogService {
    //#region CREATE BLOG WITH PROP
    async create(title: string, slug: string, description: string, categories: string[], tags: string[], status: string) {
        const t = await db.transaction();
        try {
            const createdBlog = await BlogModel.create({
                blog_title: title,
                blog_slug: slug,
                blog_description: description,
                status_id: status
            }, {transaction: t});
            await Promise.all(tags.map(async (tag_id) => {
                await BlogTagModel.create(
                    {blog_id: createdBlog.blog_id.toString(), tag_id: tag_id},
                    {transaction: t}
                );
            }));
            await Promise.all(categories.map(async (category_id) => {
                await BlogCategoryModel.create(
                    {blog_id: createdBlog.blog_id.toString(), category_id: category_id},
                    {transaction: t}
                );
            }));

            await t.commit();
            return createdBlog;
        } catch (error) {
            console.error('Blog insert error; ', error);
            await t.rollback();
            throw createHttpError(500, "Blog insert error");
        }
    }

    //#endregion

    //#region GET BLOG BY ID WITH PROP
    async findOneById(id: string) {
        try {
            const blog = await BlogModel.findByPk(id, {
                include: [
                    {
                        model: CategoryModel,
                        as: 'categories', // Belirtilen alias ismi
                        attributes: ['category_id', 'category_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    },
                    {
                        model: TagModel,
                        as: 'tags', // Belirtilen alias ismi
                        attributes: ['tag_id', 'tag_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    }
                ]
            });
            if (!blog)
                throw createHttpError(404, "Blog not found");

            return blog;
        } catch (error) {
            console.error('Database error during blog search: ', error);
            throw createHttpError(500, "An error occurred while searching for the blog. Please try again later.");
        }
    }

    //#endregion

    //#region UPDATE BLOG WITH PROP
    async updateBlog(id: string, title: string, slug: string, description: string, categories: string[], tags: string[], status: string) {
        const t = await db.transaction();
        try {
            const oldBlog = await BlogModel.findByPk(id);
            if (!oldBlog)
                throw createHttpError(404, "Blog not found");

            // Eski description'dan resim URL'lerini çıkar
            const oldImageUrls = this.extractImageUrls(oldBlog.blog_description);

            // Yeni description'dan resim URL'lerini çıkar
            const newImageUrls = this.extractImageUrls(description);

            // Silinmesi gereken resimleri belirle (eski description'da olup yeni description'da olmayanlar)
            const imagesToDelete = oldImageUrls.filter(oldUrl => !newImageUrls.includes(oldUrl));

            await oldBlog.update({
                blog_title: title,
                blog_slug: slug,
                blog_description: description,
                status_id: status,
            }, {transaction: t});

            //#region TAG SECTION
            await BlogTagModel.destroy({
                where: {blog_id: id},
                transaction: t
            });
            await Promise.all(tags.map(async (tag_id) => {
                await BlogTagModel.create(
                    {blog_id: id, tag_id: tag_id},
                    {transaction: t}
                );
            }));
            //#endregion

            //#region CATEGORY SECTION
            await BlogCategoryModel.destroy({
                where: {blog_id: id},
                transaction: t
            });
            await Promise.all(categories.map(async (category_id) => {
                await BlogCategoryModel.create(
                    {blog_id: id, category_id: category_id},
                    {transaction: t}
                );
            }));
            //#endregion

            // Hem veritabanından hem de sunucudan resimleri sil
            await Promise.all(imagesToDelete.map(async (url) => {
                // Veritabanındaki kaydı sil
                await fileService.destroy(url, t);
            }));

            await t.commit();
            return oldBlog;
        } catch (error) {
            console.error('Blog update error; ', error);
            await t.rollback();
            throw createHttpError(500, "Blog update error");
        }
    }

    //#endregion

    //#region DELETE BLOG WITH PROP
    async deleteFullBlog(id: string) {
        const t = await db.transaction();
        try {
            const blog = await BlogModel.findByPk(id, {transaction: t});

            if (!blog)
                throw createHttpError(404, "Blog not found");


            // Blog açıklamasındaki resim URL'lerini bul
            const imageUrls = this.extractImageUrls(blog.blog_description);


            if (imageUrls.length > 0) {
                // Hem veritabanından hem de sunucudan resimleri sil
                await Promise.all(imageUrls.map(async (url) => {
                    // Veritabanındaki kaydı sil
                    await fileService.destroy(url, t);
                }));
            }

            await BlogTagModel.destroy({
                where: {blog_id: blog.blog_id.toString()},
                transaction: t
            });

            await BlogCategoryModel.destroy({
                where: {blog_id: blog.blog_id.toString()},
                transaction: t
            });

            // Blog'u sil
            await blog.destroy({transaction: t});
            await t.commit();
            return true;
        } catch (error) {
            console.error('Blog delete error; ', error);
            await t.rollback();
            throw createHttpError(500, "An error occurred while deleting the blog.");
        }
    }


    // Blog açıklamasından resim URL'lerini çıkarmak için regex kullanan fonksiyon
    private extractImageUrls(description: string): string[] {
        const urlPattern = /\/uploads\/[a-zA-Z0-9\-\_]+\.[a-zA-Z]{3,4}/g;
        const matches = description.match(urlPattern);
        return matches ? matches : [];
    }


    //#endregion

    //#region GET FULL ALL BLOG WITH PROP
    async getAll() {
        try {
            const blog = await BlogModel.findAll({
                include: [
                    {
                        model: CategoryModel,
                        as: 'categories', // Belirtilen alias ismi
                        attributes: ['category_id', 'category_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    },
                    {
                        model: TagModel,
                        as: 'tags', // Belirtilen alias ismi
                        attributes: ['tag_id', 'tag_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    }
                ]
            });
            if (!blog)
                throw createHttpError(404, "Blog not found");

            return blog;
        } catch (error) {
            console.error('Database error during get all blog: ', error);
            throw createHttpError(500, "An error occurred while get all for the blog. Please try again later.");
        }
    }

    //#endregion

    //#region GET BLOG BY STATUS WITH PROP
    async getAllByStatus(status_id: string) {
        try {
            const blog = await BlogModel.findAll({
                include: [
                    {
                        model: CategoryModel,
                        as: 'categories', // Belirtilen alias ismi
                        attributes: ['category_id', 'category_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    },
                    {
                        model: TagModel,
                        as: 'tags', // Belirtilen alias ismi
                        attributes: ['tag_id', 'tag_name'], // Getirmek istediğiniz alanlar
                        through: {attributes: []} // Ara tablodan veri istemiyorsanız boş bırakın
                    }
                ],
                where: {status_id: status_id}
            });
            if (!blog)
                throw createHttpError(404, "Blog not found");

            return blog;
        } catch (error) {
            console.error('Database error during get all blog: ', error);
            throw createHttpError(500, "An error occurred while get all for the blog. Please try again later.");
        }
    }


    //#endregion

}

export const blogService = new BlogService();