import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";

interface BlogsInstance
    extends Model<
        InferAttributes<BlogsInstance>,
        InferCreationAttributes<BlogsInstance>
    > {
    blog_id: CreationOptional<BigInt>;
    blog_title: string;
    blog_slug: string;
    blog_description: string;
    status_id: string;
}

const Blog = db.define<BlogsInstance>(
    "blogs",
    {
        blog_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        blog_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        blog_slug: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blog_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        tableName: "blogs",
        timestamps: true,
        paranoid: true,
    }
);


export default Blog;