import {WebSocketServer} from "ws";

export let wssConnection: WebSocketServer;
export const setWssCon = (wss: WebSocketServer) => {
  wssConnection = wss;
};
