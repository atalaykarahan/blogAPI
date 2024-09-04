import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";

interface TagsInstance
    extends Model<
        InferAttributes<TagsInstance>,
        InferCreationAttributes<TagsInstance>
    > {
    tag_id: CreationOptional<BigInt>;
    tag_name: string;
}

const Tag = db.define<TagsInstance>(
    "tags",
    {
        tag_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        tag_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "tags",
        timestamps: true,
        paranoid: true,
    }
);


export default Tag;