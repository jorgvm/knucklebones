import { GameData } from "@knucklebones/shared/types.js";
import { supabase } from "~/supabase/client.js";
import { mapRowToGameData } from "~/supabase/map-row-to-gamedata.js";

/**
 * Retrieve GameData
 */
export const getGameFromDatabase = async (
  gameId: string,
): Promise<GameData> => {
  const response = await supabase.select().eq("id", gameId);
  const game = response?.data?.[0];

  if (!response?.success || !game?.id) {
    return gameNotFound;
  }

  return mapRowToGameData(game);
};

const gameNotFound: GameData = {
  id: "unknown",
  active_player: "",
  created: "",
  latest_actions: [],
  new_die: 1,
  players: [],
  rematch_id: null,
  secrets: [],
  status: "not-found",
  type: "multiplayer",
  version: 1,
  winner: [],
};
