import BlogModel from "./blog";
import BlogCategoryModel from "./blog_category";
import CategoryModel from "./category";
import TagModel from "./tag";
import BlogTagModel from "./blog_tag";

BlogModel.belongsToMany(CategoryModel, {
    through: BlogCategoryModel,
    as: 'categories',
    foreignKey: 'blog_id',
    otherKey: 'category_id'
});

CategoryModel.belongsToMany(BlogModel, {
    through: BlogCategoryModel,
    as: 'blogs',
    foreignKey: 'category_id',
    otherKey: 'blog_id'
});

BlogModel.belongsToMany(TagModel, {
    through: BlogTagModel,
    as: 'tags',
    foreignKey: 'blog_id',
    otherKey: 'tag_id'
})

TagModel.belongsToMany(BlogModel, {
    through: BlogTagModel,
    as: 'blogs',
    foreignKey: 'tag_id',
    otherKey: 'blog_id'
})


export {BlogModel, CategoryModel, BlogCategoryModel, TagModel, BlogTagModel};