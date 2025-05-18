import {
  Player,
  PlayerId,
  GameStatus,
  PlayerSecretId,
  PlayerSecret,
} from "@knucklebones/shared/types.js";

/**
 * Check if move is allowed
 */
export const moveIsAllowed = ({
  activePlayer,
  playerSecretId,
  secrets,
  gameActivePlayerId,
  gameStatus,
  rackNumber,
}: {
  activePlayer: Player;
  playerSecretId: PlayerSecretId;
  secrets: PlayerSecret[];
  gameActivePlayerId: PlayerId | null;
  gameStatus: GameStatus;
  rackNumber: number;
}): boolean => {
  // It should be this player's turn
  if (activePlayer?.id !== gameActivePlayerId) {
    throw new Error("It's not the players turn");
  }

  // It should be an active game
  if (gameStatus !== "playing") {
    throw new Error("Game is not active");
  }

  // Submitted secret should match the secret in the game data
  const playerSecret = secrets.find((secret) => secret.id === activePlayer.id);
  if (!playerSecret?.secret || playerSecret.secret !== playerSecretId) {
    throw new Error("Secret is not correct");
  }

  const playerActiveDice = activePlayer.dice.filter(
    (die) => die.status === "active"
  );
  const diceInTargetRack = playerActiveDice.filter(
    (die) => die.rack === rackNumber
  );

  // Chosen rack should not be full
  if (diceInTargetRack.length >= 3) {
    throw new Error("Rack is already full");
  }

  // Move is allowed
  return true;
};
