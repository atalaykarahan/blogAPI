import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import db from "../../db";
import {CreateBlogBody} from "../controller/blog";


// class BlogTagService {
//
//     // async delete()
//
//
// }
//
// export const blogTagService = new BlogTagService();