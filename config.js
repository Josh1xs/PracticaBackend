import { createSecretKey } from "crypto";
import dotenv from "dotenv"

dotenv.config()

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_Key
    },
    email: {
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    }
}