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
  | "die_placed"
  | "die_removed"
  | "game_finished";

export type GameStatus =
  | "loading" // fetching game data
  | "lobby" // game has been created, waiting on second player
  | "playing" // playing the game
  | "finished"; // there is a winner

export type GameData = {
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
};

export type GameMessagePayload =
  | SubscribeToGameData
  | SendJoinGameData
  | SendCreateGameData
  | SendPlaceDieData;

// Client to server actions
export type SubscribeToGameData = { gameId: GameId };
export type SendJoinGameData = {
  gameId: string;
  playerName: string;
  playerId: string | null;
  playerSecretId: string | null;
};
export type SendCreateGameData = {
  playerName: string;
  playerId: string | null;
  playerSecretId: string | null;
};
export type SendPlaceDieData = {
  gameId: GameId;
  playerId: PlayerId;
  playerSecretId: PlayerSecretId;
  rackNumber: RackNumber;
};
export type SendCreateRematch = {
  previousPlayers: Player[];
  previousSecrets: PlayerSecret[];
  previousWinner: PlayerId[];
};

// Server to client actions
export type ResultJoinGameData = {
  playerId: PlayerId;
  playerSecretId: PlayerSecretId;
};
export type ResultCreateGameData = {
  playerId: PlayerId;
  gameId: GameId;
  playerSecretId: PlayerSecretId;
};
export type ResultCreateRematch = {
  gameId: GameId;
};

export type SocketAction =
  | "createGame"
  | "joinGame"
  | "subscribeToGame"
  | "placeDie";

export type DataHandler<T> = (data: T) => void;
