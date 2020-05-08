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
export default class CollsionMgr extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter(other: any, self: any) {
        if(other.node.group == "egg" && self.node.group == "char") {
            let mc = self.node.getComponent("MCController");
            // mc.canPickEgg = true;
            // mc.egg = other;
            mc.addEggsCanPick(other, self);
        }

        if(other.node.group == "egg" && self.node.group == "bot") {
            self.node.getComponent("Bot").pickEggUp(other);
        }
    }

    onCollisionExit(other: any, self: any) {
        if(other.node.group == "egg" && self.node.group == "char") {
            let mc = self.node.getComponent("MCController");
            mc.removeEggsCanPick(other, self);
        }
    }

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    start () {

    }

    // update (dt) {}
}
