import dotenv from 'dotenv';
import path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

// Load the env file from the project root
dotenv.config({ path: path.resolve(process.cwd(), envFile) });


export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/article',
  ACCESS_JWT_TOKEN: process.env.ACCESS_JWT_TOKEN || 'secret_key',
  REFRESH_JWT_TOKEN: process.env.REFRESH_JWT_TOKEN || 'secret_key',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  EMAIL: process.env.EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,

};
