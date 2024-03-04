import {WebSocket} from "ws";

export interface BattleShipWSS extends WebSocket {
  playerId: number;
  botInfo: {
    isSinglePlay: boolean;
    botId: number | null;
    gameId: number | null;
  }
}
