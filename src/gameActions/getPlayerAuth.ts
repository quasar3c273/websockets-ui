import { createRandomId } from "~/utils/createRandomId";
import { ResponseType } from "~/types/Request";
import { generalMessage } from "~/ws_server/wsActions/sendWSMsgForAllActive";
import {players, wsStore} from "~/store/wsStore";
import {DEFAULT_BOT_INFO} from "~/constants";
import {addPlayer, getRoomList, getWinsTable} from "~/services/utils";
import {CreatorRoomData, GameWS} from "~/models/interfacesTypes";

const handlePlayerAuth = (socket: GameWS, data: string): void => {
  try {
    let authResponseData
    const { name, password }: CreatorRoomData = JSON.parse(data)
    const existingPlayer = Object.values(players)
      .find(player => player.name === name && player.password === password)

    if (existingPlayer) {
      authResponseData = {
        index: existingPlayer.id,
        name,
        error: false,
        errorText: '',
      };

      wsStore.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && (client as GameWS).playerId === existingPlayer.id) {
          client.terminate();
        }
      });

      socket.playerId = existingPlayer.id
      socket.botInfo = DEFAULT_BOT_INFO

      generalMessage(ResponseType.UPDATE_ROOM, JSON.stringify(getRoomList()))
      generalMessage(ResponseType.UPDATE_WINNER_LIST, JSON.stringify(getWinsTable()))
    } else {
      const id = createRandomId();
      socket.playerId = id;
      socket.botInfo = DEFAULT_BOT_INFO

      const addPlayerResult = addPlayer(name, password, id)
      const { isSuccessful, message } = addPlayerResult

      authResponseData = {
        index: socket.playerId,
        name,
        error: !isSuccessful,
        errorText: isSuccessful ? '' : message,
      };

      if (isSuccessful) {
        generalMessage(ResponseType.UPDATE_ROOM, JSON.stringify(getRoomList()))
        generalMessage(ResponseType.UPDATE_WINNER_LIST, JSON.stringify(getWinsTable()))
      }
    }

    const authResponse = {
      type: ResponseType.REG,
      data: JSON.stringify(authResponseData),
      id: 0,
    }
    socket.send(JSON.stringify(authResponse))
  } catch (err) {
    console.error(err.message)
  }
};

export default handlePlayerAuth;
