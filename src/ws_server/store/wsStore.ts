import {WebSocketServer} from "ws";
import {Player} from "~/types/playerModel";
import {Game, Win} from "~/types/gameModel";
import {Room} from "~/types/roomModel";

export let gameWss: WebSocketServer

export const setNewWssStore = (wss: WebSocketServer) => {
  gameWss = wss;
};

export const players: { [key: string]: Player; } = {};
export const rooms: { [key: string]: Room; } = {};
export const games: { [key: string]: Game; } = {};
export const winners: { [key: string]: Win; } = {};
