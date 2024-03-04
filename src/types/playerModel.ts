import {CustomShip} from "~/types/shipModel";

export interface Player {
  id: number;
  name: string;
  password: string;
}

export interface GamePlayerData {
  index: number;
  name: string;
  ships: CustomShip[];
  board: Array<Array<string>>;
  isActive: boolean;
}
