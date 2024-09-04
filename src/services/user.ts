import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";


class UserService {
    async login(email: string, password: string) {
        const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (emailRegex.test(email)) {
            const user = await UserModel.findOne({
                where: {user_email: email},
            });
            if (!user) {
                throw createHttpError(401, "Invalid credentials");
            }
            const passwordMatch = await bcrypt.compare(
                password,
                user.user_password
            );
            if (!passwordMatch) {
                throw createHttpError(401, "Invalid credentials");
            }
            const {user_password, ...result} = user["dataValues"];
            return result;
        } else {
            throw createHttpError(401, "Invalid credentials");
        }
    }


}

export const userService = new UserService();