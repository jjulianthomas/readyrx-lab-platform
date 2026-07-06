import type { CorsOptions } from "cors";

const vitePorts = ["5173", "5174", "5175"];
const localOrigins = vitePorts.flatMap((port) => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`
]);

export function createCorsOptions(): CorsOptions {
  const configured = process.env.LAB_PLATFORM_ALLOWED_ORIGINS;
  const allowedOrigins = configured === undefined
    ? localOrigins
    : configured.split(",").map((origin) => origin.trim()).filter(Boolean);

  return {
    origin(origin, callback) {
      if (origin === undefined || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed"));
    }
  };
}
