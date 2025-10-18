import type {
  GameData,
  Die,
  SendPlaceDieData,
  GameAction,
} from "@knucklebones/shared/types.js";
import { randomIntBetween } from "@knucklebones/shared/utilities/random-int-between.js";
import {
  isValidFirebaseDocumentId,
  isRackNumber,
} from "@knucklebones/shared/utilities/sanitise.js";
import { actionCreateRematch } from "~/actions/create-rematch.js";
import {
  getGameFromDatabase,
  updateGameInDatabase,
} from "~/utilities/firebase.js";
import { isValidCryptoId, generateId } from "~/utilities/generate-id.js";
import { getWinner } from "~/utilities/get-winner.js";
import { isGameReady } from "~/utilities/is-game-ready.js";
import { moveIsAllowed } from "~/utilities/move-is-allowed.js";
import { nextBotMove } from "~/utilities/next-bot-move.js";
import { removeDice } from "~/utilities/remove-dice.js";
import { rollDie } from "~/utilities/roll-die.js";
import { getPlayerScore } from "~/utilities/score.js";
import { botId, botSecretId } from "~/utilities/server-id.js";

export const actionPlaceDie = async ({
  gameId,
  playerId,
  playerSecretId,
  rackNumber,
}: SendPlaceDieData): Promise<{ result: string }> => {
  // Validate input
  if (
    !isValidCryptoId(playerId) ||
    !isValidCryptoId(playerSecretId) ||
    !isValidFirebaseDocumentId(gameId) ||
    !isRackNumber(rackNumber)
  ) {
    throw new Error("Place die input is not valid");
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
    playerSecretId,
    secrets: gameData.secrets,
    gameActivePlayerId: gameData.active_player,
    gameStatus: gameData.status,
    rackNumber,
  });

  if (!isMoveAllowed) {
    throw new Error("Move is not allowed");
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
  const latestActions: GameAction[] = ["die_placed"];
  const newOpponentDice = removeDice({
    dice: opponent.dice,
    rackNumber,
    dieValue: gameData.new_die,
  });
  const opponentRemoved = opponent.dice.filter(
    (i) => i.status === "removed"
  ).length;
  const newOpponentRemoved = newOpponentDice.filter(
    (i) => i.status === "removed"
  ).length;

  if (newOpponentRemoved > opponentRemoved) {
    opponent.dice = newOpponentDice;
    latestActions.push("die_removed");
  }

  // Roll new die
  gameData.new_die = rollDie();

  // Calculate player score
  gameData.players.forEach((player) => (player.score = getPlayerScore(player)));

  // Change active player
  gameData.active_player = opponent.id;

  // Check if game is done
  if (isGameReady(gameData)) {
    const winner = getWinner(gameData.players);
    gameData.status = "finished";
    gameData.active_player = "";
    gameData.winner = winner;
    latestActions.push("game_finished");

    // Create rematch
    const { gameId: newGameId } = await actionCreateRematch({
      previousPlayers: gameData.players,
      previousSecrets: gameData.secrets,
      previousWinner: winner,
      previousType: gameData.type,
    });
    gameData.rematch_id = newGameId;
  }

  // Update game in database
  await updateGameInDatabase(gameId, {
    active_player: gameData.active_player,
    players: gameData.players,
    new_die: gameData.new_die,
    status: gameData.status,
    winner: gameData.winner,
    rematch_id: gameData.rematch_id,
    latest_actions: latestActions,
  });

  // If player made a move and game is singleplayer, wait and then place a die
  if (
    gameData.status === "playing" &&
    gameData.type === "singleplayer" &&
    activePlayer.id !== botId
  ) {
    const randomWait = randomIntBetween(1000, 2500);

    setTimeout(() => {
      const rackNumber = nextBotMove({
        gameData,
        newDieValue: gameData.new_die,
      });

      actionPlaceDie({
        gameId,
        playerId: botId,
        playerSecretId: botSecretId,
        rackNumber,
      });
    }, randomWait);
  }

  return { result: "success" };
};
