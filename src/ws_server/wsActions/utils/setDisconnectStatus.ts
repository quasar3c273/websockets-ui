import {gameWss} from "~/ws_server/store/wsStore";
import {WebSocket} from "ws";
import {BattleShipWSS} from "~/types/wsModel";

export const setDisconnectStatusPlayer = (playerIdToDisconnect: number): void => {
  gameWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const {playerId} = client as BattleShipWSS;
      if (playerId === playerIdToDisconnect) {
        client.close();
      }
    }
  });
};
