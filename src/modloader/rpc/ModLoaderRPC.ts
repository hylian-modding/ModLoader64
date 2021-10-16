import http, { Server } from 'http';
import { bus } from 'modloader64_api/EventHandler';
import { RPCEvents, RPC_Receieve_Event } from 'modloader64_api/RPC';

export class ModLoaderRPC {

    private server!: Server;

    setup() {
        try {
            this.server = http.createServer(function (req, res) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                let resp = new RPC_Receieve_Event(req);
                bus.emit(RPCEvents.ON_RECEIVE, resp);
                res.write(JSON.stringify(resp.response));
                res.end();
            }).listen(6500);
            this.server.on('error', (err)=>{
            });
        } catch (err: any) {
        }
    }

}