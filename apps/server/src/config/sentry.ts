import * as Sentry from "@sentry/node";
import { config } from "./env.js";

export function initSentry() {
  Sentry.init({
    dsn: config.sentryDsn,
    sendDefaultPii: true,
    debug: false,
  });
}

export function setupErrorHandlers() {
  // Handle errors
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    Sentry.captureMessage("Unhandled rejection", { extra: { reason } });
  });
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    Sentry.captureException(error);
  });
}
