import {WebSocketServer} from "ws";
import {Player, Room} from "~/models/interfacesTypes";

export let wsStore: WebSocketServer;
export const setWssCon = (wss: WebSocketServer) => {
  wsStore = wss;
};

export const players: { [key: string]: Player; } = {};
export const roomInfo: { [key: string]: Room; } = {};
