import {createRandomNum} from "~/utils/createRandomNum";
import {addPlayer, createGame, getPlayer} from "~/ws_server/store/utils";
import {msgForPLayer} from "~/utils/msgForPLayer";
import {BattleShipWSS} from "~/types/wsModel";
import {ActionTypes, BOT_NAME} from "~/constants";

const selectSinglePlayAction = (socket: BattleShipWSS): void => {
  const gameId = createRandomNum();
  const botId = socket.botInfo.botId || createRandomNum();
  const playerData = getPlayer(socket.playerId);

  if (socket.botInfo.botId) {
    socket.botInfo = {...socket.botInfo, isSinglePlay: true, gameId};
  } else {
    socket.botInfo = {
      isSinglePlay: true,
      botId,
      gameId,
    };

    addPlayer(`${BOT_NAME}-${playerData.name}`, createRandomNum().toString(), botId);
  }

  const botData = getPlayer(botId);

  const gamePlayers = [{index: socket.playerId, name: playerData.name}, {index: botId, name: botData.name}];
  createGame(gameId, gamePlayers);

  const createGameData = gamePlayers.map((player) => ({
    [player.index]: JSON.stringify({idGame: gameId, idPlayer: player.index}),
  }));
  msgForPLayer(ActionTypes.CREATE_GAME, createGameData);
};
export {selectSinglePlayAction};
