import {addPlayerToRoom, createGame, deletePlayersRooms, getRoomList} from "~/ws_server/store/utils";
import {createRandomNum} from "~/utils/createRandomNum";
import {msgForPLayer} from "~/utils/msgForPLayer";
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {ActionTypes, TWO} from "~/constants";

const addPlayerToRoomAction = (socket: BattleShipWSS, data: string): void => {
  const {indexRoom} = JSON.parse(data);
  const roomInfo = addPlayerToRoom(indexRoom, socket.playerId)

  if (roomInfo?.length === TWO) {
    const gameId = createRandomNum()
    const createGameData = roomInfo.map((player) => ({
      [player.index]: JSON.stringify({idGame: gameId, idPlayer: player.index}),
    }))

    createGame(gameId, roomInfo)

    msgForPLayer(ActionTypes.CREATE_GAME, createGameData);
    deletePlayersRooms(roomInfo.map((player) => player.index))
  }

  updateWssData(ActionTypes.UPDATE_ROOM, JSON.stringify(getRoomList()))
}

export { addPlayerToRoomAction }
