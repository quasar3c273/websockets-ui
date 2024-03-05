import {httpServer} from '~/http_server';
import {handleWsConnection} from './ws_server';
import {httpPort, wsPort, wss} from "~/constants";
import {setNewWssStore} from "~/ws_server/store/wsStore";

httpServer.listen(httpPort, () => {
  console.log(`HTTP server listening on port ${httpPort}`);
});

setNewWssStore(wss);

console.log(`Websocket server listening on port ${wsPort}`);

wss.on('connection', handleWsConnection);
