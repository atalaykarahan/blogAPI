import express, {NextFunction, Request, Response} from "express";
import userRoutes from "./routes/user";
import blogRoutes from "./routes/blog";
import * as dotenv from 'dotenv';
import * as path from 'path';
import env from "./util/validateEnv";
import cors from "cors";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import SequelizeStore from 'connect-session-sequelize';
import sequelize from '../db';

dotenv.config({path: path.resolve(__dirname, '../.env')});

// Port and express defination
const app = express();
const port = env.PORT;

// SequelizeStore'ü initialize et
const Store = SequelizeStore(session.Store);
const sessionStore = new Store({
    db: sequelize,
});

// Express session middleware'ını yapılandır
app.use(
    session({
        secret: 'mycookiesecretCode',
        store: sessionStore,
        saveUninitialized: false,
        resave: false, // 'false' olarak ayarlanmalı, çünkü 'touch' yöntemi destekleniyor
        cookie: {
            domain: env.COOKIE_DOMAIN,
            sameSite: 'strict', // strict olarak ayarlandı
            secure: false, // Canlı ortamda HTTPS kullanıldığı için secure true
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

sessionStore.sync();

app.use(
    cors({
        origin: env.WEBSITE_FULL_URL,
        credentials: true,
    })
);

// For logs endpoint on the console
app.use(morgan("dev"));

// for post methods
app.use(express.json());

// for public folder
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// User routes api/v1/users
app.use("/api/v1/users", userRoutes);


// Blog routes api/v1/blogs
app.use("/api/v1/blogs", blogRoutes);


app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error: errorMessage});
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
