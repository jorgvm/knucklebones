import { GameData } from "@knucklebones/shared/types.js";
import { supabase } from "~/database/client.js";
import { mapRowToGameData } from "~/database/map-row-to-gamedata.js";

/**
 * Update existing game
 */
export const updateGameInDatabase = async (
  gameId: string,
  data: Partial<GameData>,
): Promise<GameData> => {
  const response = await supabase.update(data).eq("id", gameId).select();

  if (!response?.success) {
    throw new Error(`Updating ${gameId} failed`);
  }

  return mapRowToGameData(response?.data?.[0]);
};
