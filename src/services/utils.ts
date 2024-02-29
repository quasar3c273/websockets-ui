import {RoomPlayerData, Win} from "~/models/player-models";
import {roomInfo, winners} from "~/store/wsStore";

export const getRoomList = (): { roomId: number; roomUsers: RoomPlayerData[] }[] => {
  return Object.values(roomInfo)
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({roomId: room.roomId, roomUsers: room.roomUsers}))
}

export const getWinsTable = (): Win[] => {
  try {
    return Object.values(winners);
  } catch (error) {
    throw new Error('Error while wins table get');
  }
};
