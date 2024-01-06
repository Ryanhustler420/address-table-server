import "dotenv/config";

export const ENV = () => process.env.NODE_ENV || "development";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE = process.env.DATABASE || "address-table-server";
export const JWT_KEY = process.env.JWT_KEY || "secret";
export const PORT = process.env.PORT ? +process.env.PORT : 8080;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345";
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
