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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
 
    private gamePlay: GamePlay = null;

    private static instance_: Game = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Game.getInstance().gamePlay = this.node.getChildByName("action_phase").getComponent("GamePlay");
    }

    start () {

    }

    // update (dt) {}

    public static getInstance(): Game {
        if(Game.instance_ == null) {
            Game.instance_ = new Game();
        }
        return Game.instance_;
    }

    getGamePlay(): GamePlay {
        return Game.getInstance().gamePlay;
    }
}
