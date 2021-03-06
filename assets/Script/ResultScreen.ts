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
export default class ResultScreen extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
    }

    // update (dt) {}
    playAgainButtonClicked(event: any, data: any) {
        ScreenMgr.getInstance().changeScreen(ScreenStatus.action_phase);
        Game.getInstance().getGamePlay().reset();
    }

    // exitButtonClicked(event: any, data: any) {
    //     ScreenMgr.getInstance().changeScreen(ScreenStatus.start_screen);
    //     Game.getInstance().getGamePlay().reset();
    // }
}
