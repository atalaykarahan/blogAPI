import createHttpError from "http-errors";
import db from "../../db";
import {BlogModel, CategoryModel, TagModel} from "../models/associations";
import {fileService} from "./file";


class BlogService {
    //#region CREATE BLOG WITH PROP
    async create(title: string, slug: string, description: string, status: string) {
        const t = await db.transaction();
        try {
            const createdBlog = await BlogModel.create({
                blog_title: title,
                blog_slug: slug,
                blog_description: description,
                status_id: status
            }, {transaction: t});

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
    async updateBlog(id: string, title: string, slug: string, description: string, status: string) {
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
            const blog = await BlogModel.findAll({});
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
            const blog = await BlogModel.findAll({where: {status_id: status_id}});
            if (!blog)
                throw createHttpError(404, "Blog not found");
            return blog;
        } catch (error) {
            console.error('Database error during get all blog: ', error);
            throw createHttpError(500, "An error occurred while get all for the blog. Please try again later.");
        }
    }

    //#endregion

    //#region GET BLOG BY SLUG WITH PROP
    async findOneBySlug(slug: string) {
        try {
            const blog = await BlogModel.findOne({
                where: {blog_slug: slug, status_id: 2},
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

    //#region GET BLOG BY STATUS WITH PROP
    async getHomePageBlogs() {
        try {
            // status = 2 olamlı
            const blogs = await BlogModel.findAll({
                where: {status_id: 2},
                order: [['updatedAt', 'DESC']]
            });
            if (!blogs)
                throw createHttpError(404, "Blog not found");


            const imageUrlPattern = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif))/g;
            const blogWithImages = blogs.map((blog: any) => {
                const blogData = blog.toJSON();

                const imageUrls = blog.blog_description.match(imageUrlPattern);


                if (imageUrls && imageUrls.length > 0) {
                    blogData.blog_cover_image = imageUrls[0];
                }
                return blogData;

            })
            return blogWithImages;
        } catch (error) {
            console.error('Database error during get all blog: ', error);
            throw createHttpError(500, "An error occurred while get all for the blog. Please try again later.");
        }
    }

    //#endregion

}

export const blogService = new BlogService();