import {
  GameData,
  Player,
  ResultCreateRematch,
  SendCreateRematch,
} from "@knucklebones/shared/types.js";
import { createGameInDatabase } from "~/utilities/firebase.js";
import { randomIntBetween } from "@knucklebones/shared/utilities/random-int-between.js";

import { rollDie } from "~/utilities/roll-die.js";

export const actionCreateRematch = async ({
  previousPlayers,
  previousSecrets,
  previousWinner,
}: SendCreateRematch): Promise<ResultCreateRematch> => {
  let newActivePlayer;
  if (previousWinner.length > 1) {
    // It was at tie, choose a random player to go first
    const random = randomIntBetween(0, 1);

    newActivePlayer = previousPlayers[random].id;
  } else {
    // The loser in the last game gets to play first
    newActivePlayer = previousPlayers.find(
      (i) => i.id !== previousWinner[0]
    )?.id;
  }

  if (!newActivePlayer) {
    throw new Error("There was a problem choosing a new player");
  }

  const newPlayerData: Player[] = previousPlayers.map((player) => ({
    dice: [],
    host: false,
    id: player.id,
    name: player.name,
    score: 0,
  }));

  // Create game
  const newGameData: GameData = {
    active_player: newActivePlayer,
    created: new Date().toISOString(),
    new_die: rollDie(),
    players: newPlayerData,
    rematch_id: null,
    secrets: previousSecrets,
    status: "playing",
    version: 1,
    winner: [],
    latest_actions: [],
  };

  // Push to database
  const gameId = await createGameInDatabase(newGameData);

  if (!gameId) {
    throw new Error("Something went wrong during rematch creation");
  }

  return {
    gameId,
  };
};
