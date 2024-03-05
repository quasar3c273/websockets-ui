import {createRandomNum} from "~/utils/createRandomNum";
import {createRoom, addPlayerToRoom, getRoomList} from "~/ws_server/store/utils";
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {ActionTypes} from "~/constants";

const createRoomAction = (socket: BattleShipWSS): void => {
  const roomId = createRandomNum()

  createRoom(roomId)
  addPlayerToRoom(roomId, socket.playerId)

  updateWssData(ActionTypes.UPDATE_ROOM, JSON.stringify(getRoomList()))
}
export {createRoomAction}
