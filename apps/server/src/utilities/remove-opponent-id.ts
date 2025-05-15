import { GameData, PlayerId } from "@knucklebones/shared/types.js";
import { OPPONENT_ID } from "@knucklebones/shared/utilities/constants.js";

/**
 * Remove opponent id from game data
 *
 * By keeping it secret, we can prevent cheating
 */
export const removeOpponentId = (
  gameData: GameData,
  opponentId?: PlayerId
): GameData => {
  // If there is no opponent yet, no need to check object
  if (!opponentId) {
    return gameData;
  }

  return replaceValueInObject(gameData, opponentId, OPPONENT_ID);
};

/**
 * Returns given object, with a target string replaced
 *
 */
export const replaceValueInObject = <T>(
  obj: T,
  target: string,
  replaceWith: string
): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      replaceValueInObject(item, target, replaceWith)
    ) as T;
  } else if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = replaceValueInObject(obj[key], target, replaceWith);
      }
    }
    return result as T;
  } else if (obj === target) {
    return replaceWith as T;
  }
  return obj;
};
