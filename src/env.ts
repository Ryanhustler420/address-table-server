export const ENV = () => process.env.NODE_ENV || "development";
export const JWT_KEY = process.env.JWT_KEY || "secret";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT ? +process.env.PORT : 3000;