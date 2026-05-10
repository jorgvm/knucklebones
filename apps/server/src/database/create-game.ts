import type { GameData } from "@knucklebones/shared/types.js";
import { supabase } from "~/database/client.js";

/**
 * Create new game
 *
 * @returns Promise with game id
 */
export const createGameInDatabase = async (
  data: Partial<GameData>,
): Promise<string> => {
  const response = await supabase.insert(data).select();
  const id = response.data?.[0]?.id;

  if (!response?.success || !id) {
    throw new Error(`Post was not succesfull: ${response}`);
  }

  return id;
};
