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
    eggIndex: number = 0;
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
            {"id": "mc", "x": 0, "y": 0, "pick": false, "score": 0, "eggId": undefined},
            // {"id": "bot", "x": 0, "y": 0, "pick": false, "score": 0, "eggId": undefined}
        ];
        for(let i: number = 0; i < Game.getInstance().botCount; i++) {
            let randomPos = Game.getInstance().getGamePlay().createNewEggPos();
            let botObj: object = Game.getInstance().createCharObj("bot", randomPos.x, randomPos.y, false, 0, undefined, i);
            jsonData["charInfo"].push(botObj);
        }
        let randomeEggPos = Game.getInstance().getGamePlay().createNewEggPos()
        // console.log("randomeEggPos:" + randomeEggPos);
        jsonData["eggs"] = [{"id": ServerSim.getInstance().eggIndex,"x": randomeEggPos.x, "y": randomeEggPos.y}];
        // console.log(JSON.stringify(jsonData));
        ServerSim.getInstance().serverData = JSON.stringify(jsonData);
    }

    updateServerData(jsonData: any, dt: number): void {
        let jsonServerData: any = JSON.parse(ServerSim.getInstance().serverData);
        let charInfo: any = jsonServerData["charInfo"];
        let eggsInfo: any = jsonServerData["eggs"];
        for(let char of charInfo) {
            if(char.id == jsonData.id) {
                if(char.id == "mc" || char.botID == jsonData.botID) {
                    char.x = Math.round(jsonData.x);
                    char.y = Math.round(jsonData.y);
                    char.pick = jsonData.pick;
                    char.eggId = jsonData.eggId;
                    if(char.pick == true) { 
                        // console.log("pick");
                        if(eggsInfo.some((egg: any) => {
                            return egg.id == char.eggId;
                        })) {
                            char.score = char.score + 1;
                            ServerSim.getInstance().spawnNewEgg(eggsInfo);
                        }
                        eggsInfo = eggsInfo.filter((egg: any) => {
                            return egg.id != char.eggId;
                        });
                        char.pick = false;
                    }
                }
            }
        }
        jsonServerData["eggs"] = eggsInfo;
        jsonServerData["charInfo"] = charInfo;
        // console.log("`updateServerData` - " + JSON.stringify(jsonServerData));
        ServerSim.getInstance().serverData = JSON.stringify(jsonServerData);
    }

    spawnNewEgg(eggsInfo: any): void {
        // console.log("[ServerSim] `spawnNewEgg`");
        let randomeEggPos = Game.getInstance().getGamePlay().createNewEggPos()
        // let jsonData = JSON.parse(ServerSim.getInstance().serverData);
        ServerSim.getInstance().eggIndex = ServerSim.getInstance().eggIndex + 1;
        eggsInfo.push({"id": ServerSim.getInstance().eggIndex, "x": randomeEggPos.x, "y": randomeEggPos.y});
        // console.log(JSON.stringify(jsonData));
        // ServerSim.getInstance().serverData = JSON.stringify(jsonData);
    }
}
