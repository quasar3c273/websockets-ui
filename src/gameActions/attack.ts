import {
  getActivePlayer,
  getOpponentPlayer,
  decreaseShipHealth,
  changeBoardCellStatus,
  getWinsTable,
  checkShipsHealth,
  clearGameData,
  addWinToTable,
  changeActivePlayer,
} from "~/ws_server/store/utils";
import {getRandomCoordinate} from "~/utils/getRandomCoordinate";
import {getSurroundCoordinates} from "~/utils/get-surround-coordinates";
import {setBotAttackAction} from "~/gameActions/botPlay";
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {AttackRequest} from "~/types/requestModel";
import {Coordinate} from "~/types/gameModel";
import {GamePlayerData} from "~/types/playerModel";
import {ActionTypes, ONE, ZERO} from "~/constants";
import {sendInfoActionForAll} from "~/gameActions/utils/sendInfoActionForAll";

const attackAction = (socket: BattleShipWSS, data: string): void => {
  const requestData: AttackRequest = JSON.parse(data);
  const {gameId, indexPlayer} = requestData;
  const activePlayerId = getActivePlayer(gameId);
  const opponentPlayer = getOpponentPlayer(gameId, indexPlayer) as GamePlayerData;
  const playersIds = [indexPlayer, opponentPlayer.index];
  const {board, ships: enemyShips} = opponentPlayer;

  let {x, y} = requestData;
  console.log('{x, y}', {x, y})

  if (indexPlayer !== activePlayerId) {
    return;
  }

  if (x === undefined && y === undefined) {
    const randomCoordinate = getRandomCoordinate(board) as Coordinate;
    x = randomCoordinate.x;
    y = randomCoordinate.y;
  }

  if (board[x][y] === '' || board[x][y] === 'miss') {
    let hitShipIndex = -1;
    for (let i = ZERO; i < enemyShips.length; i += ONE) {
      const ship = enemyShips[i];
      if (ship.coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y)) {
        hitShipIndex = i;
      }
    }

    if (hitShipIndex !== -1) {
      decreaseShipHealth(gameId, opponentPlayer.index, hitShipIndex);

      const hitShip = enemyShips[hitShipIndex];

      const gameTurnData = JSON.stringify({currentPlayer: indexPlayer});

      if (hitShip.health === ZERO) {
        hitShip.coordinates.forEach((coordinates) => {
          const killAttackData
            = JSON.stringify({position: {x: coordinates.x, y: coordinates.y}, currentPlayer: indexPlayer, status: 'killed'});
          sendInfoActionForAll(ActionTypes.ATTACK, killAttackData, playersIds);
          changeBoardCellStatus(gameId, opponentPlayer.index, coordinates.x, coordinates.y, 'kill');
        });

        const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);
        surroundCoordinates.forEach((coordinates) => {
          changeBoardCellStatus(gameId, opponentPlayer.index, coordinates.x, coordinates.y, 'miss');

          const missAttackData = JSON.stringify({position: coordinates, currentPlayer: indexPlayer, status: 'miss'});
          sendInfoActionForAll(ActionTypes.ATTACK, missAttackData, playersIds);
        });
        sendInfoActionForAll(ActionTypes.TURN, gameTurnData, playersIds);

        const areAllShipsKilled = checkShipsHealth(gameId, opponentPlayer.index);

        if (areAllShipsKilled) {
          addWinToTable(indexPlayer);

          const finishData = JSON.stringify({winPlayer: indexPlayer});
          sendInfoActionForAll(ActionTypes.FINISH, finishData, playersIds);
          updateWssData(ActionTypes.UPDATE_WINNERS, JSON.stringify(getWinsTable()));

          clearGameData(indexPlayer);

          if (socket.botInfo.isSinglePlay) {
            socket.botInfo.isSinglePlay = false;
          }
        }
      } else {
        changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'shot');

        const shotAttackData = JSON.stringify({position: {x, y}, currentPlayer: indexPlayer, status: 'shot'});
        sendInfoActionForAll(ActionTypes.ATTACK, shotAttackData, playersIds);
        sendInfoActionForAll(ActionTypes.TURN, gameTurnData, playersIds);
      }
    } else {
      changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'miss');
      changeActivePlayer(gameId, indexPlayer);

      const missAttackData = JSON.stringify({position: {x, y}, currentPlayer: indexPlayer, status: 'miss'});
      sendInfoActionForAll(ActionTypes.ATTACK, missAttackData, playersIds);
      sendInfoActionForAll(ActionTypes.TURN, JSON.stringify({currentPlayer: opponentPlayer.index}), playersIds);

      if (socket.botInfo.isSinglePlay) {
        setTimeout(() => {
          setBotAttackAction(socket, gameId, indexPlayer);
        }, 500);
      }
    }
  } else {
    sendInfoActionForAll(ActionTypes.TURN, JSON.stringify({currentPlayer: indexPlayer}), playersIds);
  }
}
export {attackAction}
