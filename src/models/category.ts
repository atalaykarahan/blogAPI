import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";

interface CategoriesInstance
    extends Model<
        InferAttributes<CategoriesInstance>,
        InferCreationAttributes<CategoriesInstance>
    > {
    category_id: CreationOptional<BigInt>;
    category_name: string;
}

const Category = db.define<CategoriesInstance>(
    "categories",
    {
        category_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "categories",
        timestamps: true,
        paranoid: true,
    }
);


export default Category;