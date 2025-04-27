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
import type { Dice, GameData } from "~/utilities/types";

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
  const activePlayer = gameData.players.find((i) => i.id === playerId);
  const opponent = gameData.players.find((player) => player.id !== playerId);
  if (!gameData || !activePlayer || !opponent) {
    throw new Error("Invalid game data");
  }

  // Check if move is allowed
  if (!moveIsAllowed(playerId, gameData, rackNumber)) {
    throw new Error("Illegal move");
  }

  // Place dice in rack
  const newDice: Dice = {
    id: generateId(),
    created: new Date().toISOString(),
    rack: rackNumber,
    status: "active",
    value: gameData.new_dice,
  };
  activePlayer.dice.push(newDice);

  // Check if game is done
  if (isGameReady(gameData)) {
    // todo, set winner
    gameData.status = "finished";
  }

  await updateGameInDatabase(gameId, {
    active_player: opponent.id,
    players: gameData.players,
    new_dice: rollDice(),
    status: gameData.status,
  });

  return { result: "success" };
});
