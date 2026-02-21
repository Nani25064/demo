import "./loadEnv"; // must be first: runs before dataSource so DATABASE_URL is set
import { AppDataSource } from "./dataSource";
import { createApp } from "./app";

async function bootstrap() {
  await AppDataSource.initialize();

  // ✅ AUTO-MIGRATIONS (Production practice)
  // Why: when we deploy, DB schema must match the code version.
  // This runs all pending migrations in order.
  // If migrations fail, we crash startup -> prevents serving broken API.
  console.log("Running migrations...");
  await AppDataSource.runMigrations();

  // ✅ In production container, we run migrations before starting
  // This is handled in Dockerfile CMD (see below). Here we only start server.
  const app = createApp();
  const port = Number(process.env.PORT || 8080);

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

bootstrap().catch((e) => {
  console.error("Fatal startup error:", e);
  process.exit(1);
});