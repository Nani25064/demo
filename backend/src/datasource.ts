import "./loadEnv"; // load .env.local so DATABASE_URL is set when CLI uses this file (e.g. migration:generate)
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import path from "path";

const root = path.resolve(__dirname, ".."); // server/ in dev, /app in prod
console.log( "root", root);

// Dev: ts-node runs from src/ → load .ts from src/migrations. Prod: node runs from dist/src/ → load .js from dist/src/migrations
const migrationsDir = process.env.NODE_ENV === "production"
  ? path.join(root, "dist", "migrations", "*.js")
  : path.join(root, "src", "migrations", "*.ts");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Product],
  migrations: [migrationsDir],
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
