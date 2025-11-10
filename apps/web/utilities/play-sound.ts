import type { GameAction, GameData, PlayerId } from "@shared/types";
import { randomIntBetween } from "@shared/utilities/random-int-between";
import { waitFor } from "@shared/utilities/wait-for";
import { vibrate } from "~/utilities/vibrate";

export type Sound =
  | "start-game-1"
  | "lost-1"
  | "won-1"
  | "won-2"
  | "place-1"
  | "place-2"
  | "place-3"
  | "place-4"
  | "place-5"
  | "place-6"
  | "place-7"
  | "destroy-1";

export const playSound = (soundName: Sound, volume = 1): void => {
  const audio = new Audio(`/sfx/${soundName}.mp3`);
  audio.volume = volume;
  audio.play().catch((e) => {
    console.warn(`Could not play sound ${soundName}:`, e);
  });
};

export const checkGameStatus = (
  gameData: GameData,
  localPlayerId: PlayerId | null,
) => {
  const isTie = gameData.winner.length > 1;

  const localPlayerTurn = gameData.active_player === localPlayerId;

  const gameWon = gameData.winner.includes(localPlayerId || "");

  const gameLost =
    !gameWon && gameData.latest_actions.includes("game_finished");

  return {
    isTie,
    localPlayerTurn,
    gameWon,
    gameLost,
  };
};

export const handleGameSounds = async (
  newGameData: GameData,
  localPlayerId?: PlayerId,
): Promise<void> => {
  const actions: GameAction[] = newGameData.latest_actions;

  if (!actions?.length) {
    return;
  }

  const { gameWon, gameLost } = checkGameStatus(
    newGameData,
    localPlayerId || "",
  );

  // Watch for a winner or a tie
  if (actions.includes("die_placed")) {
    playSound(("place-" + randomIntBetween(1, 4)) as Sound);
  }

  if (actions.includes("game_created")) {
    playSound("start-game-1", 0.2);
  }

  if (actions.includes("game_finished") && gameWon) {
    console.log("gamewon");
    playSound("won-2", 0.6);
  }

  if (actions.includes("game_finished") && gameLost) {
    console.log("gamelost");
    playSound("lost-1", 0.3);
  }

  if (actions.includes("die_removed")) {
    await waitFor(1000);
    vibrate();
    playSound("destroy-1", 0.8);
  }
};
