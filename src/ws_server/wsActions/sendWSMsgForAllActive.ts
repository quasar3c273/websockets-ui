import {wsStore} from "~/store/wsStore";

export const generalMessage = (type: string, data: string): void => {
  try {
    const response = {
      type,
      data,
      id: 0,
    }

    for (const client of wsStore.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    }

    console.log(`Msg for all: type: ${type}, value: ${data}`);
  } catch (err) {
    console.error(err.message);
  }
}
