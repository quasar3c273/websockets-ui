import {Coordinate} from "~/types/gameModel";
import {BOARD_LENGTH} from "~/constants";

export const getSurroundCoordinates = (shipCoordinates: Coordinate[]) => {
  try {
    const surroundCoordinates: Coordinate[] = [];

    shipCoordinates.forEach((coordinate) => {
      const { x, y } = coordinate;

      surroundCoordinates.push({ x: x - 1, y }, { x: x + 1, y });
      surroundCoordinates.push({ x, y: y - 1 }, { x, y: y + 1 });
      surroundCoordinates.push({ x: x - 1, y: y - 1 }, { x: x + 1, y: y + 1 });
      surroundCoordinates.push({ x: x - 1, y: y + 1 }, { x: x + 1, y: y - 1 });
    });

    const filteredCoords = surroundCoordinates.filter((coordinate) => coordinate.x >= 0
      && coordinate.y >= 0
      && coordinate.x < BOARD_LENGTH
      && coordinate.y < BOARD_LENGTH
      && !shipCoordinates.some((coordinates) => coordinate.x === coordinates.x && coordinate.y === coordinates.y));

    const uniqueStrings = new Set(filteredCoords.map((coordinates) => JSON.stringify(coordinates)));
    return Array.from(uniqueStrings).map(((str) => JSON.parse(str)));
  } catch (error) {
    throw new Error('Error while getting surround coordinates');
  }
};
