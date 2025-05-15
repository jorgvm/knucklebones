import type {
  GameId,
  PlayerId,
  RackNumber,
  GameData,
  Die,
} from "@knucklebones/shared/types.js";
import {
  isValidFirebaseDocumentId,
  isRackNumber,
} from "@knucklebones/shared/utilities/sanitise.js";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase.js";
import { isValidCryptoId, generateId } from "~/utilities/generate-id.js";
import { isGameReady } from "~/utilities/is-game-ready.js";
import { moveIsAllowed } from "~/utilities/move-is-allowed.js";
import { removeDice } from "~/utilities/remove-dice.js";
import { rollDie } from "~/utilities/roll-die.js";
import { getPlayerScore } from "~/utilities/score.js";

export const actionPlaceDie = async ({
  gameId,
  playerId,
  rackNumber,
}: {
  gameId: GameId;
  playerId: PlayerId;
  rackNumber: RackNumber;
}): Promise<{ result: string }> => {
  // Validate input
  if (
    !isValidCryptoId(playerId) ||
    !isValidFirebaseDocumentId(gameId) ||
    !isRackNumber(rackNumber)
  ) {
    throw new Error("Game not found");
  }

  // Get game from database
  const gameData = (await getGameFromDatabase(gameId)) as GameData;
  const activePlayer = gameData.players.find((i) => i.id === playerId);
  const opponent = gameData.players.find((player) => player.id !== playerId);

  // Check if move is allowed
  if (!gameData || !activePlayer || !opponent) {
    throw new Error("Invalid game data");
  }
  const isMoveAllowed = moveIsAllowed({
    activePlayer,
    gameActivePlayerId: gameData.active_player,
    gameStatus: gameData.status,
    rackNumber,
  });

  if (!isMoveAllowed) {
    throw new Error("Illegal move");
  }

  // Place die in rack
  const newDie: Die = {
    id: generateId(),
    created: new Date().toISOString(),
    rack: rackNumber,
    status: "active",
    value: gameData.new_die,
  };
  activePlayer.dice.push(newDie);

  // Remove dice from opponent
  opponent.dice = removeDice({
    dice: opponent.dice,
    rackNumber,
    dieValue: gameData.new_die,
  });

  // Roll new die
  gameData.new_die = rollDie();

  // Calculate player score
  gameData.players.forEach((player) => (player.score = getPlayerScore(player)));

  // Change active player
  gameData.active_player = opponent.id;

  // Check if game is done
  if (isGameReady(gameData)) {
    gameData.status = "finished";
    gameData.active_player = "";
    // gameData.winner = // todo
  }

  // Update game in database
  await updateGameInDatabase(gameId, {
    active_player: gameData.active_player,
    players: gameData.players,
    new_die: gameData.new_die,
    status: gameData.status,
  });

  return { result: "success" };
};
