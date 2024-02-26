import { WebSocket } from 'ws';

export class WebSocketWithId extends WebSocket {
  id = Math.floor(Math.random() * 1000);
}
