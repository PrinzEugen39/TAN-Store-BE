/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | undefined;
      PORT: string;
      DATABASE: string;
      DATABASE_PASSWORD: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRES_IN: string;
      CLOUDINARY_NAME: string;
      CLOUDINARY_KEY: string;
      CLOUDINARY_SECRET: string;
      EMAIL_FROM: string;
      EMAIL_PASSWORD: string;
      EMAIL_USERNAME: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
    }
  }
}

export {};
