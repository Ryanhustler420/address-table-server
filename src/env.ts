import "dotenv/config";

export const ENV = () => process.env.NODE_ENV || "development";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE = process.env.DATABASE || "address-table-server";
export const JWT_KEY = process.env.JWT_KEY || "ydO4VUkf5eAJ4aub97zhaD8Vm3pPFOC9TTLt528R";
export const PORT = process.env.PORT ? +process.env.PORT : 8081;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SW5ziV9wGzq1wxOb8dok5ua2EjzHr5Tgf93GOQcF";
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
export const RABBIT_MQ = process.env.RABBIT_MQ || "amqp://appname:password@localhost:port";
