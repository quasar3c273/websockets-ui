import {getShipCoordinates} from "~/utils/get-ship-coordinates";
import {generateBotShips} from "~/utils/generateBotShips";
import {addShipsToGameBoard, getActivePlayer} from "~/ws_server/store/utils";
import {msgForPLayer} from "~/utils/msgForPLayer";
import {BattleShipWSS} from "~/types/wsModel";
import {CustomShip, Ship} from "~/types/shipModel";
import {ActionTypes, BOARD_LENGTH} from "~/constants";
import {sendInfoActionForAll} from "~/gameActions/utils/sendInfoActionForAll";

const addShipsAction = (socket: BattleShipWSS, data: string): void => {
  const {gameId, ships, indexPlayer} = JSON.parse(data) as {
    gameId: number;
    ships: Ship[];
    indexPlayer: number;
  }
  const shipsWithCoords = getShipCoordinates(ships)

  const board = Array.from({ length: BOARD_LENGTH }, () => Array(BOARD_LENGTH).fill(''))
  let botBoard
  let botShips

  if (socket.botInfo.isSinglePlay && socket.botInfo.botId) {
    botShips = generateBotShips() as CustomShip[];
    botBoard = Array.from({ length: BOARD_LENGTH }, () => Array(BOARD_LENGTH).fill(''));
    addShipsToGameBoard(gameId, socket.botInfo.botId, botShips, botBoard);
  }

  const playersShipData = addShipsToGameBoard(gameId, indexPlayer, shipsWithCoords, board)

  if (playersShipData) {
    const responseData = playersShipData.map((player) => ({
      [player.currentPlayerIndex]: JSON.stringify({
        ships: player.ships,
        currentPlayerIndex: player.currentPlayerIndex,
      }),
    }));

    msgForPLayer(ActionTypes.START_GAME, responseData)

    const activePlayer = getActivePlayer(gameId)
    const playersIds = Array.from(playersShipData, player => player.currentPlayerIndex)

    if (activePlayer) {
      sendInfoActionForAll(ActionTypes.TURN, JSON.stringify({currentPlayer: activePlayer}), playersIds)
    }
  }
}

export { addShipsAction }
