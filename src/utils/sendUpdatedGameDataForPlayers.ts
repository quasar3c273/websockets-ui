import {wsStore} from "~/store/wsStore";
import {GameWS} from "~/models/interfacesTypes";

export const sendUpdatedGameDataForPlayers = (type: string, data: { [key: string]: string; }[]): void => {
  const clients = Array.from(wsStore.clients)
    .filter((client) => client.readyState === WebSocket.OPEN) as GameWS[]

  clients.forEach((client) => {
    const player = data.find((item) => item[client.playerId])
    if (player) {
      const msg = {
        type,
        data: player[client.playerId],
        id: 0,
      };
      client.send(JSON.stringify(msg))

      console.log(`Msg: type: ${type}, player: ${player[client.playerId]}`)
    }
  })
}
