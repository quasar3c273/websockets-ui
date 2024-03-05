import {gameWss} from "~/ws_server/store/wsStore";
import {WebSocket} from "ws";
import {BattleShipWSS} from "~/types/wsModel";
import {createResponseData} from "~/utils/createResponseData";

export const sendInfoActionForAll = (type: string, data: string, playerIds: number[]): void => {
  gameWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && playerIds.includes((client as BattleShipWSS).playerId)) {
      client.send(JSON.stringify(createResponseData(type, data, 0)));
    }
  });
  console.log(`sendInfoActionForAll: ${type}`)
};
