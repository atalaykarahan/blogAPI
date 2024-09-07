import {cleanEnv, port, str, url} from "envalid";

export default cleanEnv(process.env, {
    POSTGRE_CONNECTION_STRING: str(),
    PORT: port(),
    WEBSITE_FULL_URL: url(),
    IMAGE_BASE_URL: url(),
    COOKIE_DOMAIN:str(),
});