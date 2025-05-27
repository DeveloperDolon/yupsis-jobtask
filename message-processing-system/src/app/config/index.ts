import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  database_url: process.env.MONGODB_URI,
  port: process.env.PORT || 3000,
  bcrypt_solid_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_token_expires_time:
    process.env.JWT_REFRESH_TOKEN_REXPIRATION_TIME,
  jwt_access_token_expires_time: process.env.JWT_ACCESS_TOKEN_REXPIRATION_TIME,
  strip_publishable_key: process.env.STRIP_PUBLISHABLE_KEY,
  strip_secret_key: process.env.STRIP_SECRET_KEY
};
