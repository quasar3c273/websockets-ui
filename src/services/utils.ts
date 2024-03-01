import {Win} from "~/models/player-models";
import {players, roomInfo, winners} from "~/store/wsStore";
import {RoomUsersData} from "~/models/interfacesTypes";

export const getRoomList = (): { roomId: number; roomUsers: RoomUsersData[] }[] => {
  return Object.values(roomInfo)
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({roomId: room.roomId, roomUsers: room.roomUsers}))
}

export const getWinsTable = (): Win[] => {
  return Object.values(winners)
}

export const addPlayer = (name: string, password: string, id: number): { message: string, isSuccessful: boolean } => {
  const playerWithExistingName = Object.values(players).find((player) => player.name === name)

  if (playerWithExistingName && playerWithExistingName.password !== password) {
    return {message: 'Error: Invalid password', isSuccessful: false}
  }

  players[id] = {id, name, password}

  return {message: '', isSuccessful: true}
}

export const addPlayerToRoom = (roomId: number, playerId: number): RoomUsersData[] => {
  const playerInfo: RoomUsersData = {
    index: playerId,
    name: players[playerId].name,
  }

  if (!roomInfo[roomId].roomUsers.some((roomPlayer) => roomPlayer.index === playerId)) {
    roomInfo[roomId].roomUsers.push(playerInfo)
  }

  return roomInfo[roomId].roomUsers
}
