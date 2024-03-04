import {disconnectAction} from '~/gameActions/disconnect';
import {authPlayerAction} from "~/gameActions/auth";
import {createRoomAction} from "~/gameActions/createRoom";
import {addPlayerToRoomAction} from "~/gameActions/addUserToRoom";
import {addShipsAction} from "~/gameActions/addShip";
import {attackAction} from "~/gameActions/attack";
import {selectSinglePlayAction} from "~/gameActions/singlePlay";
import {ActionTypes} from "~/constants";
import {BattleShipWSS} from "~/types/wsModel";

export const handleWsConnection = (socket: BattleShipWSS): void => {
  socket.on('message', (msg: Buffer) => {
    try {
      const { type, data }: {
        type: string;
        data: string;
        id: number;
      } = JSON.parse(msg.toString());

      console.log(`Received command: ${type}, value: ${data}`);

      switch (type) {
        case ActionTypes.REG:
          authPlayerAction(socket, data);
          break;

        case ActionTypes.CREATE_ROOM:
          createRoomAction(socket);
          break;

        case ActionTypes.ADD_USER_TO_ROOM:
          addPlayerToRoomAction(socket, data);
          break;

        case ActionTypes.ADD_SHIPS:
          addShipsAction(socket, data);
          break;

        case ActionTypes.ATTACK:
          attackAction(socket, data);
          break;

        case ActionTypes.RANDOM_ATTACK:
          attackAction(socket, data);
          break;

        case ActionTypes.SINGLE_PLAY:
          selectSinglePlayAction(socket);
          break;

        default:
          console.error(`Unknown command: ${data}`);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });

  socket.on('close', () => {
    try {
      disconnectAction(socket);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });
};
