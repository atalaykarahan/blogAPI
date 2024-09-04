import {cleanEnv, port, str, url} from "envalid";

export default cleanEnv(process.env, {
    POSTGRE_CONNECTION_STRING: str(),
    PORT: port(),
    WEBSITE_FULL_URL: url(),
    IMAGE_BASE_URL: url(),
    // SESSION_SECRET: str(),
    // RESEND_API_KEY: str(),
    // JWT_SECRET_RSA: str(),
    // JWT_PASSWORD_RESET: str(),
    // BUCKET_NAME: str(),
    // BUCKET_REGION: str(),
    // BUCKET_ACCESS_KEY: str(),
    // BUCKET_SECRET_ACCESS_KEY: str(),
    // COOKIE_DOMAIN: str()

});