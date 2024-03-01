import {GameWS} from "~/models/interfacesTypes";
import {addPlayerToRoom, deleteRooms, getRoomList} from "~/services/utils";
import {createRandomId} from "~/utils/createRandomId";
import {createGame} from "~/services/store-service";
import {sendUpdatedGameDataForPlayers} from "~/utils/sendUpdatedGameDataForPlayers";
import {RequestType, ResponseType} from "~/types/Request";
import {generalMessage} from "~/ws_server/wsActions/sendWSMsgForAllActive";
import {TWO} from "~/constants";

const addToRoom = (socket: GameWS, data: string): void => {
  try {
    const {indexRoom} = JSON.parse(data);
    const roomPlayers = addPlayerToRoom(indexRoom, socket.playerId);

    if (roomPlayers?.length === TWO) {
      const gameId = createRandomId();
      createGame(gameId, roomPlayers);

      const createGameData = roomPlayers.map((player) => ({
        [player.index]: JSON.stringify({idGame: gameId, idPlayer: player.index}),
      }));

      sendUpdatedGameDataForPlayers(RequestType.CREATE_ROOM, createGameData);
      deleteRooms(roomPlayers.map((player) => player.index));
    }

    generalMessage(ResponseType.UPDATE_ROOM, JSON.stringify(getRoomList()));
  } catch (err) {
    console.error(err.message);
  }
};
export {addToRoom};
