import {Coordinate} from "~/types/gameModel";

export interface Ship {
  position: Coordinate;
  direction: boolean;
  length: number;
  type: string;
}

export interface CustomShip extends Ship {
  health: number;
  coordinates: Coordinate[];
}
