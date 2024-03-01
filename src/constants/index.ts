import dotenv from "dotenv";
import {WebSocketServer} from "ws";

dotenv.config();

export const httpPort = Number(process.env.HTTP_PORT) || 8181;
export const wsPort = Number(process.env.WS_PORT) || 3000;

export const wss = new WebSocketServer({port: wsPort});

export const DEFAULT_BOT_INFO = {
  isSinglePlay: false,
  botId: null,
  gameId: null,
}

