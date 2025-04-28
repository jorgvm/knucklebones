export type DiceStatus = "active" | "removed";

export type Dice = {
  created: string;
  id: string;
  rack: 0 | 1 | 2;
  status: DiceStatus;
  value: number;
};

export type Rack = Dice[];

export type Racks = [Rack, Rack, Rack];

export type PlayerId = string;

export type GameId = string;

export type Player = {
  dice: Dice[];
  host: boolean;
  id: PlayerId;
  name: string;
  score: number;
};

export type GameStatus =
  | "lobby" // waiting on more players
  | "playing" // playing the game
  | "finished"; // there is a winner

export type GameData = {
  active_player: PlayerId | null;
  created: string;
  id: GameId;
  new_dice: number;
  players: Player[];
  status: GameStatus;
  version: number;
  winner: PlayerId | null;
};
