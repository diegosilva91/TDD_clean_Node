require("dotenv").config();
module.exports = {

    APP_PORT: process.env.APP_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    JWT_KEY: process.env.JWT_KEY
}