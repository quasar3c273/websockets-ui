import {WebSocketServer} from "ws";

export let wsStore: WebSocketServer;
export const setWssCon = (wss: WebSocketServer) => {
  wsStore = wss;
};

export const players = {};
export const roomInfo = {};
export const games = {};
export const winners = {};
