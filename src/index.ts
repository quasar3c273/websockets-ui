import {httpServer} from './http_server/index';
import {actionsWS} from './ws_server';
import {setWssCon} from "~/store/wsStore";
import {httpPort, wsPort, wss} from "~/constants";


httpServer.listen(httpPort, () => {
  console.log(`HTTP server on port: ${httpPort}`);
});

setWssCon(wss);

console.log(`Websocket server on port: ${wsPort}`);

wss.on('connection', actionsWS);
