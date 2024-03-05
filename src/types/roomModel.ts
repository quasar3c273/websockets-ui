export interface RoomPlayerData {
  index: number;
  name: string;
}

export interface Room {
  roomId: number;
  roomUsers: RoomPlayerData[];
  board: string[];
  position: string[];
}
