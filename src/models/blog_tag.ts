import {DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";
import BlogModel from './blog';
import TagModel from './tag';

interface BlogTagInstance
    extends Model<
        InferAttributes<BlogTagInstance>,
        InferCreationAttributes<BlogTagInstance>
    > {
    blog_id: string;
    tag_id: string;
}

const BlogTag = db.define<BlogTagInstance>(
    "blog_tag",
    {
        blog_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: BlogModel, // Bağlandığı ana model
                key: 'blog_id'
            }
        },
        tag_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: TagModel, // Bağlandığı ana model
                key: 'tag_id'
            }
        },
    },
    {
        tableName: "blog_tag",
        timestamps: true,
        paranoid: true,
    }
);


export default BlogTag;