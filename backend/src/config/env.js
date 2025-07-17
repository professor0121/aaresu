import dotenv from 'dotenv';
dotenv.config();

export const ENV={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    EMAIL:process.env.EMAIL,
    EMAIL_PASS:process.env.EMAIL_PASS,
    COOKIE_SECRET:process.env.COOKIE_SECRET,
    REDIS_URL:process.env.REDIS_URL,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_USERNAME:process.env.REDIS_USERNAME,

    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_EMAIL_PASS:process.env.ADMIN_EMAIL_PASS,
    ADMIN_USERNAME:process.env.ADMIN_USERNAME,
}