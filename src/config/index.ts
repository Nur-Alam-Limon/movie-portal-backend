import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    dbUrl: process.env.DATABASE_URL,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_secret: process.env.JWT_REFRESH_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN
    }
}