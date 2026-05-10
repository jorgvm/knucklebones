import type { GameId, PlayerId, PlayerSecretId } from "./game.js";

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
