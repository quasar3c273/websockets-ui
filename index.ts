import { httpServer } from '~/http_server';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { RequestType, type RequestBody } from '~/types';
import 'dotenv/config';
import { WebSocketWithId } from '~/utils';

const HTTP_PORT = Number(process.env.HTTP_PORT) ?? 8181;
const WS_PORT = Number(process.env.WS_PORT) ?? 3000;
const HOST = process.env.HOST ?? 'localhost';

httpServer.listen({ host: HOST, port: HTTP_PORT }, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port`);
});

const wss = new WebSocketServer({ host: HOST, port: WS_PORT, WebSocket: WebSocketWithId }, () => {
  console.log(`Websocket is connected to ${WS_PORT} port`);
});

let botFor: number | undefined;
const finished = false;

wss.on('connection', async (ws) => {
  const messageStream = createWebSocketStream(ws, { decodeStrings: false });

  if (botFor) {
    console.log(`Bot with ID ${ws.id} connected to websocket`);

    botFor = undefined;
  } else {
    console.log(`Client with ID ${ws.id} connected to websocket`);
  }

  messageStream.on('data', async (chunk) => {
    const requestbody: RequestBody = JSON.parse(chunk);

    /* Registration request */
    if (requestbody.type === RequestType.REG) {
      console.log('Registration')
    }

    /* Create room request */
    if (requestbody.type === RequestType.CREATE_ROOM) {
      console.log('Create room')
    }

    /* Add user to room request */
    if (requestbody.type === RequestType.ADD_USER_TO_ROOM) {
      console.log('Add user')
    }
    
    /* Add ships */
    if (requestbody.type === RequestType.ADD_SHIPS) {
      console.log('Add ships')
    }

    /* Attack request */
    if (requestbody.type === RequestType.ATTACK || requestbody.type === RequestType.RANDOM_ATTACK) {
      console.log('Attack request')
    }

    /* Single play request */
    if (requestbody.type === RequestType.SINGLE_PLAY) {
      console.log('Single play request')
    }

    if (finished) {
      console.log('finished')
    }
  });

  /* clsoe room */
  ws.on('close', () => {
    console.log(`Client with ID ${ws.id} disconnected from websocket`);
  });

  ws.on('error', (e) => console.error(e));
});

process.on('SIGINT', () => {
  setImmediate(() => process.exit(0));
});
