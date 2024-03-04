import {gameWss} from "~/ws_server/store/wsStore";
import {WebSocket} from "ws";
import {createResponseData} from "~/utils/createResponseData";

export const updateWssData = (type: string, data: string): void => {
  for (const client of gameWss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(createResponseData(type, data, 0)));
    }
  }

  console.log(`Msg for all: type: ${type}, value: ${data}`);
}
