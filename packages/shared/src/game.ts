export type DieStatus = "active" | "removed";

export type Die = {
  created: string;
  id: string;
  rack: RackNumber;
  status: DieStatus;
  value: number;
};

export type RackNumber = number;
export type Rack = Die[];
export type Racks = [Rack, Rack, Rack];
export type PlayerId = string;
export type PlayerSecretId = string;
export type GameId = string;
export type PlayerName = string;

export type Player = {
  dice: Die[];
  host: boolean;
  id: PlayerId;
  name: PlayerName;
  score: number;
};

export type PlayerSecret = {
  id: PlayerId;
  secret: PlayerSecretId;
};

export type GameAction =
  | "game_created"
  | "game_started"
  | "game_finished"
  | "die_placed"
  | "die_removed";

export type GameStatus =
  | "loading"
  | "lobby"
  | "playing"
  | "finished"
  | "not-found";

export type GameType = "singleplayer" | "multiplayer";

export type GameData = {
  id: string;
  active_player: PlayerId | null;
  created: string;
  new_die: number;
  players: Player[];
  status: GameStatus;
  version: number;
  winner: PlayerId[];
  secrets: PlayerSecret[];
  rematch_id: GameId | null;
  latest_actions: GameAction[];
  type: GameType;
};
