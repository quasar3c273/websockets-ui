import { Coordinate } from "~/types/gameModel";
import { ZERO } from "~/constants";

const isCellEmpty = (board: string[][], x: number, y: number): boolean => {
  return board[x][y] === '';
};

const isCellInBoard = (board: string[][], x: number, y: number): boolean => {
  return x >= 0 && x < board.length && y >= 0 && y < board.length;
};

const getRandomCell = (cells: Coordinate[]): Coordinate => {
  const index = Math.floor(Math.random() * cells.length);
  return cells[index];
};

const getEmptyCells = (board: string[][]): Coordinate[] => {
  const cells: Coordinate[] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (isCellEmpty(board, i, j)) {
        cells.push({ x: i, y: j });
      }
    }
  }

  return cells;
};

const getPriorityCells = (board: string[][]): Coordinate[] => {
  const cells: Coordinate[] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 'shot') {
        if (isCellInBoard(board, i - 1, j) && isCellEmpty(board, i - 1, j)) {
          cells.push({ x: i - 1, y: j });
        }
        if (isCellInBoard(board, i + 1, j) && isCellEmpty(board, i + 1, j)) {
          cells.push({ x: i + 1, y: j });
        }
        if (isCellInBoard(board, i, j - 1) && isCellEmpty(board, i, j - 1)) {
          cells.push({ x: i, y: j - 1 });
        }
        if (isCellInBoard(board, i, j + 1) && isCellEmpty(board, i, j + 1)) {
          cells.push({ x: i, y: j + 1 });
        }
      }
    }
  }

  return cells;
};

export const getRandomCoordinate = (board: string[][]): Coordinate => {
  const emptyCells = getEmptyCells(board);
  const priorityCells = getPriorityCells(board);

  if (priorityCells.length !== ZERO) {
    return getRandomCell(priorityCells);
  }

  if (emptyCells.length !== ZERO) {
    return getRandomCell(emptyCells);
  }

  return { x: 0, y: 0 };
};
