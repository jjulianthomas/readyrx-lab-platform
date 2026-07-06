import cors from "cors";
import express from "express";
import helmet from "helmet";
import { buildContainer } from "./container";
import { createRoutes } from "./routes";
import { createCorsOptions } from "../infrastructure/security/CorsPolicy";
import { createErrorHandler } from "../interfaces/http/middleware/errorHandler";

export function createApp(): express.Express {
  const container = buildContainer();
  const app = express();

  app.use(helmet());
  app.use(cors(createCorsOptions()));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      data: { status: "ok", service: "healthcare-labs" }
    });
  });
  app.use("/api", createRoutes(container));
  app.use(createErrorHandler(container.logger));

  return app;
}
