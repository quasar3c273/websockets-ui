import {
  addWinToTable, changeActivePlayer,
  changeBoardCellStatus,
  checkShipsHealth, clearGameData,
  decreaseShipHealth,
  getOpponentPlayer, getWinsTable,
} from '~/ws_server/store/utils';
import {getRandomCoordinate} from '~/utils/getRandomCoordinate';
import {getSurroundCoordinates} from '~/utils/get-surround-coordinates';
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {CustomShip} from "~/types/shipModel";
import {Coordinate} from "~/types/gameModel";
import {GamePlayerData} from "~/types/playerModel";
import {ActionTypes, ONE, ZERO} from "~/constants";
import {sendInfoActionForAll} from "~/gameActions/utils/sendInfoActionForAll";

const makeBotShot = (
  socket: BattleShipWSS,
  gameId: number,
  board: Array<Array<string>>,
  ships: CustomShip[],
  playersIds: { [key: string]: number },
) => {
  const { x, y } = getRandomCoordinate(board) as Coordinate;

  let hitShipIndex = -1;
  for (let i = ZERO; i < ships.length; i += ONE) {
    const ship = ships[i];
    if (ship.coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y)) {
      hitShipIndex = i;
    }
  }

  if (hitShipIndex !== -1) {
    decreaseShipHealth(gameId, playersIds.player, hitShipIndex);

    const hitShip = ships[hitShipIndex];
    const gameTurnData = JSON.stringify({ currentPlayer: playersIds.bot });

    if (hitShip.health === 0) {
      hitShip.coordinates.forEach((coordinates) => {
        const killAttackData = JSON.stringify({
          position: { x: coordinates.x, y: coordinates.y },
          currentPlayer: playersIds.bot,
          status: 'killed',
        });
        sendInfoActionForAll(ActionTypes.ATTACK, killAttackData, Object.values(playersIds));

        changeBoardCellStatus(gameId, playersIds.player, coordinates.x, coordinates.y, 'kill');
      });

      const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);
      surroundCoordinates.forEach((coordinates) => {
        changeBoardCellStatus(gameId, playersIds.player, coordinates.x, coordinates.y, 'miss');

        const missAttackData = JSON.stringify({ position: coordinates, currentPlayer: playersIds.bot, status: 'miss' });
        sendInfoActionForAll(ActionTypes.ATTACK, missAttackData, Object.values(playersIds));
      });

      sendInfoActionForAll(ActionTypes.TURN, gameTurnData, Object.values(playersIds));

      const areAllShipsKilled = checkShipsHealth(gameId, playersIds.player);

      if (areAllShipsKilled) {
        addWinToTable(playersIds.bot);

        const finishData = JSON.stringify({ winPlayer: playersIds.bot });
        sendInfoActionForAll(ActionTypes.FINISH, finishData, Object.values(playersIds));
        updateWssData(ActionTypes.UPDATE_WINNERS, JSON.stringify(getWinsTable()));

        clearGameData(playersIds.bot);

        if (socket.botInfo.isSinglePlay) {
          socket.botInfo.isSinglePlay = false;
        }
      } else {
        setTimeout(() => {
          makeBotShot(socket, gameId, board, ships, playersIds);
        }, 500);
      }
    } else {
      changeBoardCellStatus(gameId, playersIds.player, x, y, 'shot');

      const shotAttackData = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'shot' });
      sendInfoActionForAll(ActionTypes.ATTACK, shotAttackData, Object.values(playersIds));
      sendInfoActionForAll(ActionTypes.TURN, gameTurnData, Object.values(playersIds));

      setTimeout(() => {
        makeBotShot(socket, gameId, board, ships, playersIds);
      }, 500);
    }
  } else {
    changeBoardCellStatus(gameId, playersIds.player, x, y, 'miss');
    changeActivePlayer(gameId, playersIds.bot);

    const missAttackData = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'miss' });
    sendInfoActionForAll(ActionTypes.ATTACK, missAttackData, Object.values(playersIds));
    sendInfoActionForAll(ActionTypes.TURN, JSON.stringify({ currentPlayer: playersIds.player }), Object.values(playersIds));
  }
};

const setBotAttackAction = (socket: BattleShipWSS, gameId: number, playerId: number) => {
  const botPlayer = getOpponentPlayer(gameId, playerId) as GamePlayerData
  const socketPlayer = getOpponentPlayer(gameId, botPlayer.index) as GamePlayerData
  const playersIds = { player: playerId, bot: botPlayer.index }

  const { board, ships } = socketPlayer
  makeBotShot(socket, gameId, board, ships, playersIds)
}

export {setBotAttackAction}
