import { GameData, RackNumber } from "@knucklebones/shared/types.js";
import { getRacks } from "@knucklebones/shared/utilities/get-racks.js";
import { botId } from "~/utilities/server-id.js";

export const nextBotMove = ({
  gameData,
}: {
  gameData: GameData;
  newDie: number;
}): RackNumber => {
  const bot = gameData.players.find((i) => i.id === botId);
  const racks = getRacks(bot?.dice || [], true);

  const newRackNumber = racks.findIndex((rack, index) => {
    console.log("rack.length", rack.length);
    if (rack.length < 3) {
      console.log("less than 3, use this one", index);
      return true;
    }
  });

  return newRackNumber;
};
