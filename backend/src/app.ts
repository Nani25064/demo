import express from "express";
import cors from "cors";
import { productRouter } from "./routes/product.routes";

export function createApp() {
  // web server framework
  const app = express();

  // Single CORS config: allow frontend origin (or * in dev). Do not use "*" with credentials: true.
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  app.use(
    cors({
      origin: corsOrigin === "*" ? "*" : corsOrigin.split(",").map((o) => o.trim()),
      credentials: corsOrigin !== "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/products", productRouter);

  // simple error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}