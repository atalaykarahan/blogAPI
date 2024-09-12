import createHttpError from "http-errors";
import FileModel from "../models/file";
import path from 'path';
import {promises as fs} from 'fs';
import {Transaction} from "sequelize";
import env from "../util/validateEnv"


class FileService {
    //#region CREATE FILE
    async create(file_id: string, file_name: string, file_url: string, file_type: string, file_size: number) {
        try {
            const createdFile = await FileModel.create({
                file_id: file_id,
                file_name: file_name,
                file_url: file_url,
                file_type: file_type,
                file_size: file_size,
                file_is_temporary: false,
            });
            return createdFile;
        } catch (error) {
            console.error('File insert error; ', error);
            const filePath = path.join(__dirname, '../../public/uploads', file_name);

            try {
                await fs.unlink(filePath); // Dosyayı sil
                console.log(`File at ${filePath} has been deleted due to an error.`);
            } catch (unlinkError) {
                console.error('Failed to delete file after insert error; ', unlinkError);
            }

            throw createHttpError(500, "File insert error");
        }
    }

    //#endregion

    //#region DESTROY
    async destroy(file_url: string, t: Transaction) {
        try {

            file_url = `${env.IMAGE_BASE_URL}${file_url}`;
            const file = await FileModel.findOne({where: {file_url: file_url}, transaction: t});

            if (!file)
                return true;

            await file.destroy({transaction: t});
            const filePath = path.join(__dirname, '../../public/uploads', file.file_name);
            console.log(filePath);
            await fs.unlink(filePath); // Dosyayı sil
            return true;
        } catch (error) {
            console.error('File delete error; ', error);
            throw createHttpError(500, "File delete error");
        }
    }

    //#endregion
}

export const fileService = new FileService();