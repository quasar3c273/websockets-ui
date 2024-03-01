import {WebSocket} from "ws";

export interface GameWS extends WebSocket {
  playerId: number;
  botInfo: {
    isSinglePlay: boolean;
    botId: number | null;
    gameId: number | null;
  }
}

export interface CreatorRoomData {
  name: string;
  password: string;
}

export interface Player {
  id: number;
  name: string;
  password: string;
}

export interface Room {
  roomId: number;
  roomUsers: RoomUsersData[];
  board: string[];
  position: string[];
}

export type RoomUsersData = {
  index: number;
  name: string;
}
