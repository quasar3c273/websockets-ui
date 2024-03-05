import {CustomShip} from "~/types/shipModel";

export const createDefaultShips = (): CustomShip[] => {
  const defaultShips: CustomShip[] = [];

  const shipTypes = ['huge', 'large', 'large', 'medium', 'medium', 'medium', 'small', 'small', 'small', 'small'];
  const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  for (let i = 0; i < shipTypes.length; i++) {
    defaultShips.push({
      position: {x: 0, y: 0},
      direction: true,
      type: shipTypes[i],
      length: shipLengths[i],
      health: shipLengths[i],
      coordinates: [],
    });
  }

  return defaultShips;
};
