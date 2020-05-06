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
export default class Game extends cc.Component {

    @property({
        type: cc.Prefab
    })
    eggPrefab: cc.Prefab = null;

    @property({
        type: cc.Prefab
    })
    mcPrefab: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.spawnNewEgg();
        this.spawnMC();
    }

    start () {

    }

    // update (dt) {}

    spawnNewEgg(): void {
        let newEgg: cc.Node = cc.instantiate(this.eggPrefab);
        this.node.addChild(newEgg);
        newEgg.setPosition(this.createNewEggPos());
    }

    createNewEggPos(): cc.Vec2 {
        let randX: number = Math.random() * this.node.width - this.node.width / 2;
        let randY: number = Math.random() * this.node.height - this.node.height / 2;
        return cc.v2(randX, randY);
    }

    spawnMC(): void {
        let newMC: cc.Node = cc.instantiate(this.mcPrefab);
        this.node.addChild(newMC);
        newMC.setPosition(cc.v2(0,0));
        newMC.getComponent("MCController").game = this;
    }
}
