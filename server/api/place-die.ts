import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase";
import { isGameReady } from "~/utilities/game/is-game-ready";
import { moveIsAllowed } from "~/utilities/game/move-is-allowed";
import { removeDice } from "~/utilities/game/remove-dice";
import { updateScore } from "~/utilities/game/score";
import { generateId } from "~/utilities/generate-id";
import { rollDie } from "~/utilities/roll-die";
import {
  isValidFirebaseDocumentId,
  isValidCryptoId,
  isNumber,
} from "~/utilities/sanitise";
import type { Die, GameData } from "~/utilities/types";

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

  // Check if move is allowed
  if (!gameData || !activePlayer || !opponent) {
    throw new Error("Invalid game data");
  }
  if (!moveIsAllowed(playerId, gameData, rackNumber)) {
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
  gameData.players.forEach((player) => updateScore(player));

  // Check if game is done
  if (isGameReady(gameData)) {
    gameData.status = "finished";
    gameData.active_player = "";
  }

  // Update game in database
  await updateGameInDatabase(gameId, {
    active_player: opponent.id,
    players: gameData.players,
    new_die: gameData.new_die,
    status: gameData.status,
  });

  return { result: "success" };
});
