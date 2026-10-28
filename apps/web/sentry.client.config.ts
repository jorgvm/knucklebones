import * as Sentry from "@sentry/nuxt";

const runtimeConfig = useRuntimeConfig();
const sentry = runtimeConfig.public.sentry as { dsn: string };

Sentry.init({
  dsn: sentry.dsn,
  debug: false,
});
