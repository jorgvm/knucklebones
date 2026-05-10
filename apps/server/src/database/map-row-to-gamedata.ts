import type {
  GameAction,
  GameData,
  GameStatus,
  GameType,
  Player,
  PlayerSecret,
} from "@knucklebones/shared/types.js";
import type { config } from "~/config/config.js";
import type { Tables } from "~/types/database.js";

type GameRow = Tables<typeof config.supabase.dbName>;

export const mapRowToGameData = (row: GameRow): GameData => ({
  id: row.id,
  active_player: row.active_player,
  created: row.created || "",
  new_die: row.new_die as number,
  players: row.players as Player[],
  status: row.status as GameStatus,
  version: row.version,
  winner: row.winner,
  secrets: row.secrets as PlayerSecret[],
  rematch_id: row.rematch_id,
  latest_actions: row.latest_actions as GameAction[],
  type: row.type as GameType,
});
