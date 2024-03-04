import {gameWss} from "~/ws_server/store/wsStore";
import {BattleShipWSS} from "~/types/wsModel";
import {WebSocket} from "ws";
import {createResponseData} from "~/utils/createResponseData";

export const msgForPLayer = (type: string, data: { [key: string]: string; }[]): void => {
  gameWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const { playerId } = client as BattleShipWSS
      const player = data.find((item) => item[playerId])
      if (player) {
        client.send(JSON.stringify(createResponseData(type, player[playerId], 0)))

        console.log(`Msg: type: ${type}`)
      }
    }
  })
}

