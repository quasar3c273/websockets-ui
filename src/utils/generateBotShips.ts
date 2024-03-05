import { getSurroundCoordinates } from './get-surround-coordinates';
import {CustomShip} from "~/types/shipModel";
import {Coordinate} from "~/types/gameModel";
import {BOARD_LENGTH, TWO} from "~/constants";
import {createDefaultShips} from "~/utils/setStartShips";

const getShipCoordinates = (length: number, x: number, y: number, isVertical: boolean): Coordinate[] | undefined => {
  try {
    const shipCoordinates = [];
    shipCoordinates.push({ x, y });

    for (let i = 1; i < length; i += 1) {
      if (isVertical) {
        shipCoordinates.push({ x, y: (y += 1) });
      } else {
        shipCoordinates.push({ x: (x += 1), y });
      }
    }
    return shipCoordinates;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const generateBotShips = (): CustomShip[] | undefined => {
  const board = new Array(BOARD_LENGTH).fill('').map(() => new Array(BOARD_LENGTH).fill(''));
  const ships: CustomShip[] = JSON.parse(JSON.stringify(createDefaultShips()));

  const setCoordinatesToBoard = (coordinates: Coordinate[], type: string) => {
    coordinates.forEach((coordinates) => {
      board[coordinates.x][coordinates.y] = type;
    });
    return coordinates;
  };

  ships.forEach((ship) => {
    let allShipsAreArranged = false;

    while (!allShipsAreArranged) {
      const x = Math.floor(Math.random() * BOARD_LENGTH);
      const y = Math.floor(Math.random() * BOARD_LENGTH);
      const isVertical = !!Math.floor(Math.random() * TWO);
      if (!isVertical && x > BOARD_LENGTH - ship.length) continue;
      if (isVertical && y > BOARD_LENGTH - ship.length) continue;

      const shipCoordinates = getShipCoordinates(ship.length, x, y, isVertical) as Coordinate[];
      const areAllCoordinatesEmpty = shipCoordinates.every((coordinates) => board[coordinates.x][coordinates.y] === '');
      const surroundCoordinates = getSurroundCoordinates(shipCoordinates);
      const areAllSurCoordinatesEmpty = surroundCoordinates.every((coordinates) => board[coordinates.x][coordinates.y] === '');

      if (!areAllCoordinatesEmpty && !areAllSurCoordinatesEmpty) continue;

      setCoordinatesToBoard(shipCoordinates, 'ship');
      setCoordinatesToBoard(surroundCoordinates, '=');

      ship.coordinates = shipCoordinates;
      ship.direction = isVertical;
      ship.health = ship.length;
      allShipsAreArranged = true;
    }
  })

  return ships
}
