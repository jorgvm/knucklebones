import { createClient } from "@supabase/supabase-js";
import { config } from "~/config/config.js";
import { Database } from "~/supabase/database.types.js";

if (
  !config.supabase.url ||
  !config.supabase.serviceKey ||
  !config.supabase.dbName
) {
  throw new Error("Supabase configuration missing");
}

const databaseName = "games";

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceKey,
).from(databaseName);
