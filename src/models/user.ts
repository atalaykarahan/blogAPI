import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";

interface UsersInstance
    extends Model<
        InferAttributes<UsersInstance>,
        InferCreationAttributes<UsersInstance>
    > {
    user_id: CreationOptional<BigInt>;
    user_name: string;
    user_email: string;
    user_password: string;
}

const User = db.define<UsersInstance>(
    "users",
    {
        user_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "users",
        timestamps: false,
        paranoid: false,
    }
);


export default User;