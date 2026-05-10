import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableLogs: true,
  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  debug: false,
});
