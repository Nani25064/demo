/**
 * Load env files before any other module that uses process.env.
 * Must be the first import in server.ts so DATABASE_URL etc. are set
 * before dataSource.ts runs.
 */
import path from "path";
import { config } from "dotenv";

const root = path.resolve(__dirname, ".."); // server/

if (process.env.NODE_ENV === "production") {
  config({ path: path.join(root, ".env.prod") });
} else {
  config({ path: path.join(root, ".env.local") });
}
