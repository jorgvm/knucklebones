export type Dice = {
  status: "ready";
  value: number;
  id: string;
  rack: 0 | 1 | 2;
  player_id: PlayerId;
};

export type Rack = Dice[];

export type Racks = [Rack, Rack, Rack];

export type PlayerId = string;

export type GameId = string;

export type Player = {
  id: PlayerId;
  name: string;
  host: boolean;
};

export type GameStatus =
  | "lobby" // waiting on more players
  | "playing" // playing the game
  | "finished"; // there is a winner

export type GameData = {
  creation_date: Date;
  version: number;
  id: GameId;
  players: Player[];
  status: GameStatus;
  active_player: PlayerId | null;
  winner: PlayerId | null;
  dice_list: Dice[];
};
