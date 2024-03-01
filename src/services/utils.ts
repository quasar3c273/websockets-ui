import {RoomPlayerData, Win} from "~/models/player-models";
import {roomInfo, winners} from "~/store/wsStore";

export const getRoomList = (): { roomId: number; roomUsers: RoomPlayerData[] }[] => {
  return Object.values(roomInfo)
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({roomId: room.roomId, roomUsers: room.roomUsers}))
}

export const getWinsTable = (): Win[] => {
  return Object.values(winners);
};
