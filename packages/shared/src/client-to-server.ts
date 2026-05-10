import type {
  GameId,
  GameType,
  PlayerId,
  Player,
  PlayerSecret,
  PlayerSecretId,
  RackNumber,
} from "./game.js";

export type GameMessagePayload =
  | SubscribeToGameData
  | SendJoinGameData
  | SendCreateGameData
  | SendPlaceDieData;

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
  type: GameType;
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
  previousType: GameType;
};

export type SocketAction =
  | "createGame"
  | "joinGame"
  | "subscribeToGame"
  | "placeDie";

export type DataHandler<T> = (data: T) => void;
