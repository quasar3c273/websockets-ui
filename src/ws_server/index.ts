import { handleDisconnect } from '~/controllers/player-controller';
import { handleAddShips, handleAttack } from '~/controllers/game-play-controller';
import { handleSinglePlay } from '~/controllers/bot-play-controller';
import {RequestType} from "~/types/Request";
import handlePlayerAuth from "~/gameActions/getPlayerAuth";
import {GameWS} from "~/models/interfacesTypes";
import {createRoom} from "~/gameActions/createRoom";
import {addToRoom} from "~/gameActions/addRoom";

export const actionsWS = (socket: GameWS): void => {
  socket.on('message', (msg: Buffer) => {
    try {
      const { type, data }: {
        type: string;
        data: string;
        id: number;
      } = JSON.parse(msg.toString());

      console.log(`Received command: ${type}, value: ${data}`);

      switch (type) {
        case RequestType.REG:
          handlePlayerAuth(socket, data);
          break;

        case RequestType.CREATE_ROOM:
          createRoom(socket);
          break;

        case RequestType.ADD_USER_TO_ROOM:
          addToRoom(socket, data);
          break;

        case RequestType.ADD_SHIPS:
          break;

        case RequestType.ATTACK:
          break;

        case RequestType.RANDOM_ATTACK:
          break;

        case RequestType.SINGLE_PLAY:
          break;

        default:
          break;
      }
    } catch (err) {
      if (err) {
        console.error(err.message);
      }
    }
  });

  socket.on('close', () => {
    try {
      handleDisconnect(socket);
    } catch (err) {
      if (err) {
        console.error(err.message);
      }
    }
  });
};
