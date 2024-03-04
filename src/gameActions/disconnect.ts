import {deletePlayersRooms, clearGameData, getRoomList, addWinToTable, getWinsTable} from '~/ws_server/store/utils';
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {ActionTypes} from "~/constants";
import {sendInfoActionForAll} from "~/gameActions/utils/sendInfoActionForAll";

const disconnectAction = (socket: BattleShipWSS): void => {
  const {playerId} = socket;
  deletePlayersRooms([playerId]);
  updateWssData(ActionTypes.UPDATE_ROOM, JSON.stringify(getRoomList()));

  const gameWinnerId = clearGameData(playerId);

  if (gameWinnerId) {
    addWinToTable(gameWinnerId);

    const finishData = JSON.stringify({winPlayer: gameWinnerId});
    sendInfoActionForAll(ActionTypes.FINISH, finishData, [gameWinnerId]);
    updateWssData(ActionTypes.UPDATE_WINNERS, JSON.stringify(getWinsTable()));
  }
};

export {disconnectAction}
