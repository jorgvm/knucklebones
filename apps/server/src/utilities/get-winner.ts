import { Player, PlayerId } from "@knucklebones/shared/types.js";

/**
 * Determines the player with the highest score
 *
 * Return array of player id's, because it could be a draw
 *
 */
export const getWinner = (players: Player[]): PlayerId[] => {
  if (players[0].score === players[1].score) {
    return [players[0].id, players[1].id];
  }

  if (players[0].score > players[1].score) {
    return [players[0].id];
  } else {
    return [players[1].id];
  }
};
