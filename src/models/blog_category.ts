import {DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";
import BlogModel from './blog';
import CategoryModel from './tag';

interface BlogCategoryInstance
    extends Model<
        InferAttributes<BlogCategoryInstance>,
        InferCreationAttributes<BlogCategoryInstance>
    > {
    blog_id: string;
    category_id: string;
}

const BlogCategory = db.define<BlogCategoryInstance>(
    "blog_category",
    {
        blog_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: BlogModel, // Bağlandığı ana model
                key: 'blog_id'
            }
        },
        category_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: CategoryModel, // Bağlandığı ana model
                key: 'category_id'
            }
        },
    },
    {
        tableName: "blog_category",
        timestamps: true,
        paranoid: true,
    }
);


export default BlogCategory;