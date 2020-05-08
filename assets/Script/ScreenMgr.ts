// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {ScreenStatus} from "./Enums"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenMgr extends cc.Component {

    actionPhase: cc.Node = null;
    resultScreen: cc.Node = null;
    startScreen: cc.Node = null;
    curScreen: ScreenStatus = null;
    // LIFE-CYCLE CALLBACKS:

    private static instance_: ScreenMgr = null;

    onLoad () {
        let screenMgr = ScreenMgr.getInstance();
        screenMgr.actionPhase = this.node.getChildByName("action_phase");
        screenMgr.resultScreen = this.node.getChildByName("result_screen");
        screenMgr.startScreen = this.node.getChildByName("start_screen");
        screenMgr.changeScreen(ScreenStatus.start_screen);
    }

    start () {

    }

    public static getInstance(): ScreenMgr {
        if(ScreenMgr.instance_ == null) {
            ScreenMgr.instance_ = new ScreenMgr();
        }

        return ScreenMgr.instance_;
    }

    changeScreen(screen: ScreenStatus) {
        ScreenMgr.getInstance().curScreen = screen;
        ScreenMgr.getInstance().actionPhase.active = ScreenMgr.getInstance().curScreen === ScreenStatus.action_phase;
        ScreenMgr.getInstance().resultScreen.active = ScreenMgr.getInstance().curScreen === ScreenStatus.result_screen;
        ScreenMgr.getInstance().startScreen.active = ScreenMgr.getInstance().curScreen === ScreenStatus.start_screen;
    }

    // update (dt) {}
    isActionPhase(): boolean {
        return ScreenMgr.getInstance().curScreen === ScreenStatus.action_phase;
    }

}
