import {GamePlayerData} from "~/types/playerModel";

export interface Game {
  idGame: number;
  readyPlayers: number;
  players: {
    [key: string]: GamePlayerData;
  };
}

export interface Win {
  name: string;
  wins: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
