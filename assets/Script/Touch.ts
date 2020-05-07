// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Touch extends cc.Component {
    
    mainChar: cc.Node = null;
    id: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start () {

    }

    // update (dt) {}

    onDestroy(): void {
        // console.log("[Touch] onDestroy");
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mainChar.getComponent("MCController").isPickingEgg = false;
    }

    onTouchStart(event: cc.Event.EventTouch): void {
        if(this.mainChar) {
            this.mainChar.getComponent("MCController").pickEggUp(this.id);
            // console.log("onTouchStart");
        }
    }

    onTouchEnd(event: cc.Event.EventTouch): void {
        if(this.mainChar) {
            this.mainChar.getComponent("MCController").isPickingEgg = false;
            // console.log("onTouchEnd");
        }
    }
}
