import {RequestHandler} from "express";
import createHttpError from "http-errors";
import {userService} from "../services/user";

//#region AUTHENTICATED USER
export const authenticatedUser: RequestHandler = async (req, res, next) => {
    res.sendStatus(200);
};
//#endregion AUTHENTICATED USER

//#region LOGIN
interface LoginBody {
    email?: string;
    password?: string;
}

export const login: RequestHandler<
    unknown,
    unknown,
    LoginBody,
    unknown
> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Missing parameters");
        }
        const user = await userService.login(email, password);
        req.session.user_id = user.user_id.toString();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
//#endregion LOGIN

//#region LOGOUT
// export const logout: RequestHandler = (req, res, next) => {
//     req.session.destroy((error) => {
//         if (error) {
//             next(error);
//         } else {
//             res.sendStatus(200);
//         }
//     });
// };
//#endregion LOGOUT

//#region EMAIL VERIFIED
// interface EmailVerifiedBody {
//     token?: string;
// }
// export const emailVerified: RequestHandler<
//     unknown,
//     unknown,
//     EmailVerifiedBody,
//     unknown
// > = async (req, res, next) => {
//     const incomingToken = req.body.token;FF
//
//     try {
//         if (!incomingToken) {
//             throw createHttpError(400, "Missing parameters");
//         }
//         const decoded = jwt.verify(incomingToken, env.JWT_SECRET_RSA);
//
//         if (decoded && typeof decoded !== "string") {
//             //  const user = await UserModel.findByPk(decoded.id);
//
//             // Check same username
//             const existingUsername = await UserModel.findOne({
//                 where: { user_name: decoded.user_name },
//             });
//
//             if (existingUsername) {
//                 throw createHttpError(
//                     409,
//                     "Username already taken. Please choose a different one or log in instead."
//                 );
//             }
//
//             // Check same email
//             const existingEmail = await UserModel.findOne({
//                 where: { user_email: decoded.email },
//             });
//
//             if (existingEmail) {
//                 throw createHttpError(
//                     409,
//                     "Username already taken. Please choose a different one or log in instead."
//                 );
//             }
//
//             const passwordHashed = await bcrypt.hash(decoded.password, 10);
//
//             await UserModel.create({
//                 user_name: decoded.user_name,
//                 user_email: decoded.email,
//                 user_email_verified: true,
//                 user_visibility: true,
//                 user_library_visibility: true,
//                 user_password: passwordHashed,
//             });
//
//             res.status(201).json({ message: "User successfully created!" });
//         }
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             // When token has been expired we have a custom error message for that
//             return res.status(401).json({
//                 error:
//                     "Your token has been expired. Please try again verification process.",
//             });
//         }
//         next(error);
//     }
// };
//#endregion EMAIL VERIFIED

//#region RESET PASSWORD
// export const resetPassword: RequestHandler = async (req, res, next) => {
//     const userInputValue = req.params.userInputValue;
//
//     try {
//         if (!userInputValue) {
//             throw createHttpError(400, "Missing parameters");
//             // throw createHttpError(404, "Mail does not exist");
//         }
//
//         let user = await UserModel.findOne({
//             where: { user_email: userInputValue, user_email_verified: true },
//         });
//
//         if (!user) {
//             user = await UserModel.findOne({
//                 where: { user_name: userInputValue, user_email_verified: true },
//             });
//         }
//
//         if (!user || !user.user_email)
//             throw createHttpError(404, "Mail does not exist");
//
//         const tokenObj = {
//             id: user.user_id,
//             email: user.user_email,
//         };
//
//         const token = jwt.sign(tokenObj, env.JWT_PASSWORD_RESET, {
//             expiresIn: "5m",
//         });
//         const confirmLink = `${env.WEBSITE_URL}/new-password?token=${token}`;
//         const resend = new Resend(env.RESEND_API_KEY);
//         const { error } = await resend.emails.send({
//             from: "Karahan Kitaplık <atalay@atalaykarahan.com>",
//             to: user.user_email,
//             subject: "Karahan kitaplık Şifreni sıfırla",
//             html: await resetPasswordMailTemplate(confirmLink),
//         });
//
//         if (error) {
//             console.log("Reset mail error: ", error);
//             throw createHttpError(503, "Reset mail could not be sent");
//         }
//
//         res.sendStatus(200);
//     } catch (error) {
//         next(error);
//     }
// };
//#endregion RESET PASSWORD

//#region NEW PASSWORD
// interface NewPasswordBody {
//     password?: string;
//     token?: string;
// }
// export const newPassword: RequestHandler<
//     unknown,
//     unknown,
//     NewPasswordBody,
//     unknown
// > = async (req, res, next) => {
//     const password = req.body.password;
//     const token = req.body.token;
//
//     try {
//         if (!token || !password) throw createHttpError(400, "Missing parameters");
//
//         const decoded = jwt.verify(token, env.JWT_PASSWORD_RESET);
//
//         if (decoded && typeof decoded !== "string") {
//             const user = await UserModel.findOne({
//                 where: {
//                     user_id: decoded.id,
//                     user_email: decoded.email,
//                     user_email_verified: true,
//                 },
//             });
//
//             if (!user) throw createHttpError(401, "User not found!");
//             const passwordHashed = await bcrypt.hash(password, 10);
//             user.user_password = passwordHashed;
//             await user.save();
//
//             res.status(201).json({ message: "Password successfully changed." });
//         } else {
//             //invalid token error
//             throw createHttpError(503, "Server error");
//         }
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             // When token has been expired we have a custom error message for that
//             return res.status(401).json({
//                 error:
//                     "Your token has been expired. Please try again verification process.",
//             });
//         }
//         next(error);
//     }
// };

//#endregion

