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

export type GameStatus =
  | "loading" // fetching game data
  | "lobby" // game has been created, waiting on second player
  | "playing" // playing the game
  | "finished"; // there is a winner

export type GameData = {
  active_player: PlayerId | null;
  created: string;
  id: GameId;
  new_die: number;
  players: Player[];
  status: GameStatus;
  version: number;
  winner: PlayerId | null;
  secrets: PlayerSecret[];
};

export type GameMessagePayload =
  | SubscribeToGameData
  | SendJoinGameData
  | SendCreateGameData
  | SendPlaceDieData;

// Client to server actions
export type SubscribeToGameData = { gameId: GameId };
export type SendJoinGameData = { gameId: string; playerName: string };
export type SendCreateGameData = { playerName: string };
export type SendPlaceDieData = {
  gameId: GameId;
  playerId: PlayerId;
  playerSecretId: PlayerSecretId;
  rackNumber: RackNumber;
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

export type SocketAction =
  | "createGame"
  | "joinGame"
  | "subscribeToGame"
  | "placeDie";
