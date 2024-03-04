import {getRoomList, checkPlayerForExistence, getWinsTable, addPlayer} from "~/ws_server/store/utils";
import {createRandomNum} from "~/utils/createRandomNum";
import {updateWssData} from "~/gameActions/utils/sendWSMsgForAllActive";
import {BattleShipWSS} from "~/types/wsModel";
import {ActionTypes, DEFAULT_BOT_INFO} from "~/constants";
import {createResponseData} from "~/utils/createResponseData";
import {setDisconnectStatusPlayer} from "~/ws_server/wsActions/utils/setDisconnectStatus";

const authPlayerAction = (socket: BattleShipWSS, data: string): void => {
  const {name, password}: {
    name: string;
    password: string;
  } = JSON.parse(data);

  const existingPlayer = checkPlayerForExistence(name, password);
  let authResponseData;
  let isSuccessful;

  if (existingPlayer) {
    authResponseData = {
      index: existingPlayer.id,
      name,
      error: false,
      errorText: '',
    };

    setDisconnectStatusPlayer(existingPlayer.id);
    socket.playerId = existingPlayer.id;
    socket.botInfo = DEFAULT_BOT_INFO

    updateWssData(ActionTypes.UPDATE_ROOM, JSON.stringify(getRoomList()));
    updateWssData(ActionTypes.UPDATE_WINNERS, JSON.stringify(getWinsTable()));
  } else {
    const id = createRandomNum();
    socket.playerId = id;
    socket.botInfo = DEFAULT_BOT_INFO

    const addPlayerResult = addPlayer(name, password, id);
    const {message} = addPlayerResult;
    isSuccessful = addPlayerResult.isSuccessful;

    authResponseData = {
      index: socket.playerId,
      name,
      error: !isSuccessful,
      errorText: isSuccessful ? '' : message,
    };
  }

  socket.send(JSON.stringify(createResponseData(ActionTypes.REG, JSON.stringify(authResponseData), 0)));

  if (isSuccessful) {
    updateWssData(ActionTypes.UPDATE_ROOM, JSON.stringify(getRoomList()));
    updateWssData(ActionTypes.UPDATE_WINNERS, JSON.stringify(getWinsTable()));
  }
};
export {authPlayerAction};
