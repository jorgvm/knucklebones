import { createClient } from "@supabase/supabase-js";
import { config } from "~/config/config.js";
import { Database } from "~/types/database.js";

if (!config.supabase.url || !config.supabase.serviceKey) {
  throw new Error("Supabase configuration missing");
}

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceKey,
).from(config.supabase.dbName);
