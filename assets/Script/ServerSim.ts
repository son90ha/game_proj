// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerSim extends cc.Component {

    mcSpeed: number = 300;

    serverData: string = "{}";
    requests: string[] = [];
    private static instance_: ServerSim = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt: number) {
        while(ServerSim.getInstance().requests.length > 0 ) {
            let requestData = ServerSim.getInstance().requests.pop();
            let jsonData = JSON.parse(requestData);
            ServerSim.getInstance().updateServerData(jsonData, dt);
        }
    }

    public static getInstance(): ServerSim {
        if(ServerSim.instance_ == null) {
            ServerSim.instance_ = new ServerSim();
        }
        return ServerSim.instance_;
    }

    initData() {
        let jsonData = JSON.parse(ServerSim.getInstance().serverData);
        jsonData["charInfo"] = [
            {"id": "mc", "x": 0, "y": 0, "pick": false, "score": 0}
        ];
        ServerSim.getInstance().serverData = JSON.stringify(jsonData);
    }

    updateServerData(jsonData: any, dt: number): void {
        let jsonServerData: any = JSON.parse(ServerSim.getInstance().serverData);
        let charInfo: any = jsonServerData["charInfo"];
        let mc = charInfo[0];
        // mc.x = mc.x + ServerSim.getInstance().mcSpeed * 0.02 * jsonData.x;
        // mc.x = (mc.x <= -Game.getInstance().getGamePlay().boxEdgeSize.x / 2) ? -Game.getInstance().getGamePlay().boxEdgeSize.x / 2 : mc.x;
        // mc.x = (mc.x >= Game.getInstance().getGamePlay().boxEdgeSize.x / 2 ) ? Game.getInstance().getGamePlay().boxEdgeSize.x / 2 : mc.x;
        // mc.y = mc.y + ServerSim.getInstance().mcSpeed * 0.02 * jsonData.y;
        // mc.y = (mc.y <= -Game.getInstance().getGamePlay().boxEdgeSize.y / 2) ? -Game.getInstance().getGamePlay().boxEdgeSize.y / 2 : mc.y;
        // mc.y = (mc.y >= Game.getInstance().getGamePlay().boxEdgeSize.y / 2 ) ? Game.getInstance().getGamePlay().boxEdgeSize.y / 2 : mc.y;
        mc.x = Math.round(jsonData.x);
        mc.y = Math.round(jsonData.y);

        console.log(`serverData: mc.x = ${mc.x}, mc.y = ${mc.y}, dt = ${dt}`);

        ServerSim.getInstance().serverData = JSON.stringify(jsonServerData);
    }
}
