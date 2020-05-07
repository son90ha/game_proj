// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GamePlay from './GamePlay'
import ServerSim from './ServerSim'
import {SendType} from './Enums'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
 
    private gamePlay: GamePlay = null;
    private serverSim: ServerSim = null;
    private timeServerUpdate: number = 0;
    private timeServerElapse: number = 0;

    private static instance_: Game = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Game.getInstance().gamePlay = this.node.getChildByName("action_phase").getComponent("GamePlay");
        Game.getInstance().serverSim = ServerSim.getInstance();
        Game.getInstance().serverSim.initData();
        Game.getInstance().renewTimeServerUpdate();
    }

    start () {

    }

    update (dt: number) {
        Game.getInstance().timeServerElapse -= dt;
        if(Game.getInstance().timeServerElapse <= 0) {
            Game.getInstance().getServerSim().update(Game.getInstance().timeServerUpdate);
            Game.getInstance().renewTimeServerUpdate();
            Game.getInstance().getGamePlay().serverAlreadyUpdated();
        }
    }

    public static getInstance(): Game {
        if(Game.instance_ == null) {
            Game.instance_ = new Game();
        }
        return Game.instance_;
    }

    getGamePlay(): GamePlay {
        return Game.getInstance().gamePlay;
    }

    getServerSim(): ServerSim {
        return Game.getInstance().serverSim;
    }

    postToServer(data: string): void {
        if(!Game.getInstance().serverSim.requests.some(request => {
            let jsonRequest = JSON.parse(request);
            let jsonData = JSON.parse(data);
            return (jsonRequest.id === jsonData.id
                &&  jsonRequest.x === jsonData.x
                &&  jsonRequest.y === jsonData.y
                &&  jsonRequest.pick === jsonData.pick
            )
        })) {
            Game.getInstance().serverSim.requests.push(data);
        }
    }

    getServerData(): string {
        return Game.getInstance().serverSim.serverData;
    }

    createCharObj(id: string, x: number, y: number, pick: boolean, score:number): object {
        return {"id": id, "x": x, "y": y, "pick": pick, "score": score};
    }

    renewTimeServerUpdate(): void {
        Game.getInstance().timeServerUpdate = Math.random() * 0.4 + 0.1;
        Game.getInstance().timeServerElapse = Game.getInstance().timeServerUpdate;
    }

    getTimeServerUpdate(): number {
        return Game.getInstance().timeServerUpdate;
    }
}
