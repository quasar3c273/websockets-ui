import {GamePlayerData, Player} from "~/types/playerModel";
import {RoomPlayerData} from "~/types/roomModel";
import {CustomShip} from "~/types/shipModel";
import {Win} from "~/types/gameModel";
import {ONE, TWO} from "~/constants";
import {games, players, rooms, winners} from "~/ws_server/store/wsStore";

export const addPlayer = (name: string, password: string, id: number): { message: string, isSuccessful: boolean } => {
  const playerWithExistingName = Object.values(players).find((player) => player.name === name);

  if (playerWithExistingName && playerWithExistingName.password !== password) {
    return {message: 'Error: Please enter a correct password', isSuccessful: false};
  }

  players[id] = {id, name, password};
  return {message: '', isSuccessful: true};
};

export const getPlayer = (id: number): Player => {
    return players[id];
};

export const checkPlayerForExistence = (name: string, password: string): Player | undefined => {
  return Object.values(players).find((player) => player.name === name && player.password === password);
};

export const createRoom = (id: number): void => {
    rooms[id] = {
      roomId: id,
      roomUsers: [],
      board: [],
      position: [],
    };
};

export const getRoomList = (): { roomId: number; roomUsers: RoomPlayerData[] }[] => {
  return Object.values(rooms)
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({roomId: room.roomId, roomUsers: room.roomUsers}));
};

export const addPlayerToRoom = (roomId: number, playerId: number): RoomPlayerData[] => {
  const playerData = {
    index: playerId,
    name: players[playerId].name,
  };

  const isExist = rooms[roomId].roomUsers.find((roomPlayer) => roomPlayer.index === playerId);

  if (!isExist) {
    rooms[roomId].roomUsers.push(playerData);
  }
  return rooms[roomId].roomUsers;
};

export const createGame = (idGame: number, gamePlayers: RoomPlayerData[]): void => {
  const playerOne = gamePlayers[0];
  const playerTwo = gamePlayers[1];

  games[idGame] = {
    idGame,
    players: {
      [playerOne.index]: {
        ...playerOne,
        ships: [],
        board: [],
        isActive: true,
      },
      [playerTwo.index]: {
        ...playerTwo,
        ships: [],
        board: [],
        isActive: false,
      },
    },
    readyPlayers: 0,
  };
};

export const deletePlayersRooms = (playerIds: number[]): void => {
  playerIds.forEach((playerId) => {
    const playersRooms
      = Object.values(rooms).filter((room) => room.roomUsers.find((user) => user.index === playerId));
    if (playersRooms.length) {
      playersRooms.forEach((room) => {
        delete rooms[room.roomId];
      });
    }
  });
};

export const clearGameData = (playerId: number): number | void => {
  const gameData = Object.values(games).find((game) => game.players[playerId]);
  let opponentPlayer;
  if (gameData) {
    opponentPlayer = Object.values(games[gameData.idGame].players).find((player) => player.index !== playerId);
    delete games[gameData.idGame];
  }
  return opponentPlayer?.index;
};

export const addShipsToGameBoard
  = (gameId: number, playerId: number, ships: CustomShip[], board: Array<Array<string>>) => {
  const game = games[gameId];
  if (!game) return;
  const player = game.players[playerId];

  if (player) {
    player.ships = ships;
    player.board = board;
    game.readyPlayers += ONE;
  }

  if (game.readyPlayers === TWO) {
    return Object.values(game.players).map((playerData) => ({
      currentPlayerIndex: playerData.index,
      ships: playerData.ships,
    }));
  }
};

export const getActivePlayer = (gameId: number): number | undefined => {
  const game = games[gameId];

  if (!game) return;
  const activePlayer = Object.values(game.players).find((player) => player.isActive);
  if (activePlayer) return activePlayer.index;
};

export const getOpponentPlayer = (gameId: number, currentPlayerId: number): GamePlayerData | undefined => {
  return Object.values(games[gameId].players).find((player) => player.index !== currentPlayerId);
};

export const changeActivePlayer = (gameId: number, currentActivePlayerId: number): void => {
  const gamePlayers = Object.values(games[gameId].players);
  gamePlayers.forEach((player) => {
    games[gameId].players[player.index].isActive = player.index !== currentActivePlayerId;
  });
};

export const decreaseShipHealth = (gameId: number, playerId: number, shipIndex: number): void => {
  games[gameId].players[playerId].ships[shipIndex].health -= 1;
};

export const checkShipsHealth = (gameId: number, playerId: number): boolean => {
  return games[gameId].players[playerId].ships.every((ship) => ship.health === 0);
};

export const addWinToTable = (playerId: number): void => {
  const playerName = players[playerId].name;
  if (winners[playerId]) {
    winners[playerId].wins += 1;
  } else {
    winners[playerId] = {
      name: playerName,
      wins: 1,
    };
  }
};

export const getWinsTable = (): Win[] => {
  return Object.values(winners);
};

export const changeBoardCellStatus = (gameId: number, playerId: number, x: number, y: number, status: string): void => {
  games[gameId].players[playerId].board[x][y] = status;
};
