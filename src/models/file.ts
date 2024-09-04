import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";
import db from "../../db";

interface FilesInstance
    extends Model<
        InferAttributes<FilesInstance>,
        InferCreationAttributes<FilesInstance>
    > {
    file_id: CreationOptional<string>;
    file_name: string;
    file_url: string;
    file_storage_provider: CreationOptional<string>;
    file_type: string;
    file_size: number;
    file_is_temporary:CreationOptional<boolean>;
}

const File = db.define<FilesInstance>(
    "files",
    {
        file_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_storage_provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_size: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        file_is_temporary: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        tableName: "files",
        timestamps: true,
        paranoid: true,
        updatedAt: false,
    }
);


export default File;