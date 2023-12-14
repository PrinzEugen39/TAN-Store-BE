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
    }
  }
}

export {};
