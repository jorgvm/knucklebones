import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  corsAllowedUrl: process.env.CORS_ALLOWED_URL,
  sentryDsn: process.env.SENTRY_DSN,
  port: process.env.PORT || 8080,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    dbName: "games" as const,
  },
} as const;
