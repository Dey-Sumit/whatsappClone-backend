declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
      CLIENT_URL: string;
      PORT: string;
      NODE_ENV: "development" | "production";
      JWT_SECRET: string;
    }
  }
}
export {};
