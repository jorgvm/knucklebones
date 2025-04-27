import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase";
import { moveIsAllowed, isGameReady } from "~/utilities/game";
import { generateId } from "~/utilities/generate-id";
import { rollDice } from "~/utilities/roll-dice";
import {
  isValidFirebaseDocumentId,
  isValidCryptoId,
  isNumber,
} from "~/utilities/sanitise";
import type { GameData } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { gameId, playerId, rackNumber } = await readBody(event);

  // Validate input
  if (
    !isValidCryptoId(playerId) ||
    !isValidFirebaseDocumentId(gameId) ||
    !isNumber(rackNumber)
  ) {
    throw new Error("Game not found");
  }

  // Get game from database
  const gameData = (await getGameFromDatabase(gameId)) as GameData;
  if (!gameData) {
    throw new Error("Game not found");
  }

  if (!moveIsAllowed(playerId, gameData, rackNumber)) {
    throw new Error("Illegal move");
  }

  // Place dice in rack
  gameData.dice_list.push({
    id: generateId(),
    player_id: playerId,
    rack: rackNumber,
    status: "active",
    value: gameData.new_dice,
  });

  // Check if game is done
  if (isGameReady(gameData)) {
    gameData.status = "finished";
    // todo, set winner
  }

  const opponent = gameData.players.find((player) => player.id !== playerId);

  await updateGameInDatabase(gameId, {
    status: gameData.status,
    dice_list: gameData.dice_list,
    new_dice: rollDice(),
    active_player: opponent?.id,
  });

  return { result: "success" };
});
