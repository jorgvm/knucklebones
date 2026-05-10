import * as Sentry from "@sentry/nuxt";

const runtimeConfig = useRuntimeConfig();
const sentry = runtimeConfig.public.sentry as { dsn: string };

Sentry.init({
  dsn: sentry.dsn,
  enableLogs: true,
  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  debug: false,
});
