// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ScreenMgr from './ScreenMgr'
import {ScreenStatus} from "./Enums"
import Game from './Game'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Label
    })
    labelBotCount: cc.Label = null;

    @property({
        type: cc.Label
    })
    labelEggCount: cc.Label = null;

    @property({
        type: cc.Label
    })
    labelTimeLimit: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.labelBotCount.string = `${Game.getInstance().botCount}`;
        this.labelEggCount.string = `${Game.getInstance().eggCount}`;
        this.labelTimeLimit.string = `${Game.getInstance().getGamePlay().timeLimit}`;
    }

    start () {

    }

    // update (dt) {}
    startButtonClick(event: any, data: any) {
        ScreenMgr.getInstance().changeScreen(ScreenStatus.action_phase);
        // Game.getInstance().getServerSim().initData();
        // Game.getInstance().getGamePlay().bots = [];
        // Game.getInstance().getGamePlay().spawnBot();
        // Game.getInstance().getGamePlay().reset();
    }

    onSubBotCountButtonClick(event: any, data: any) {
        if(Game.getInstance().botCount > 0) {
            Game.getInstance().botCount--;
            this.labelBotCount.string = `${Game.getInstance().botCount}`;
        }
    }

    onAddBotCountButtonClick(event: any, data: any) {
        Game.getInstance().botCount++;
        this.labelBotCount.string = `${Game.getInstance().botCount}`;
    }

    onSubEggCountButtonClick(event: any, data: any) {
        if(Game.getInstance().eggCount > 1) {
            Game.getInstance().eggCount--;
            this.labelEggCount.string = `${Game.getInstance().eggCount}`;
        }
    }

    onAddEggCountButtonClick(event: any, data: any) {
        Game.getInstance().eggCount++;
        this.labelEggCount.string = `${Game.getInstance().eggCount}`;
    }

    onSubTimeLimitButtonClick(event: any, data: any) {
        if(Game.getInstance().getGamePlay().timeLimit > 1) {
            Game.getInstance().getGamePlay().timeLimit--;
            this.labelTimeLimit.string = `${Game.getInstance().getGamePlay().timeLimit}`;
        }
    }

    onAddTimeLimitButtonClick(event: any, data: any) {
        Game.getInstance().getGamePlay().timeLimit++;
        this.labelTimeLimit.string = `${Game.getInstance().getGamePlay().timeLimit}`;
    }
}
