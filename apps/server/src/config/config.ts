import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  corsAllowedUrl: process.env.CORS_ALLOWED_URL,
  sentryDsn: process.env.SENTRY_DSN,
  port: process.env.PORT || 8080,
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    collectionId: process.env.FIREBASE_COLLECTION_ID,
  },
} as const;
