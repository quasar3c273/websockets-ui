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

export const ZERO = 0
export const ONE = 1
export const TWO = 2

export enum ActionTypes {
  REG = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  CREATE_ROOM = 'create_room',
  UPDATE_ROOM = 'update_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  SINGLE_PLAY = 'single_play',
  FINISH = 'finish',
  UPDATE_WINNERS = 'update_winners',
  TURN = 'turn',
}

export const BOARD_LENGTH = 10;
export const BOT_NAME = 'Bot';
