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

    @property({
        type: cc.Prefab
    })
    botPrefab: cc.Prefab = null;

    @property
    timeLimit: number = 0;

    boxEdgeSize: cc.Vec2 = cc.v2();
    score: number = 0;
    timeElapsed: number = 0;
    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.timeElapsed = this.timeLimit;
        this.boxEdgeSize = cc.v2(this.node.getChildByName("boxEdge").width, this.node.getChildByName("boxEdge").height);
        this.updateTime(this.timeLimit);
        this.updateScore();
        this.spawnNewEgg();
        this.spawnMC();
        this.spawnBot();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start () {

    }

    update (dt: number) {
        if(this.timeElapsed > 0) {
            this.timeElapsed -= dt;
            if(this.timeElapsed <= 0) {
                this.timeElapsed = 0;
            }
            this.updateTime(this.timeElapsed);
        }
    }

    onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    spawnNewEgg(): void {
        let newEgg: cc.Node = cc.instantiate(this.eggPrefab);
        this.node.addChild(newEgg);
        newEgg.setPosition(this.createNewEggPos());
    }

    createNewEggPos(): cc.Vec2 {
        let randX: number = Math.random() * this.boxEdgeSize.x - this.boxEdgeSize.x / 2;
        let randY: number = Math.random() * this.boxEdgeSize.y - this.boxEdgeSize.y / 2;
        return cc.v2(randX, randY);
    }

    spawnMC(): void {
        let newMC: cc.Node = cc.instantiate(this.mcPrefab);
        this.node.addChild(newMC);
        newMC.setPosition(cc.v2(0,0));
        newMC.getComponent("MCController").game = this;
    }

    spawnBot(): void {
        let newBot: cc.Node = cc.instantiate(this.botPrefab);
        this.node.addChild(newBot);
        newBot.setPosition(cc.v2(0,0));
        newBot.getComponent("Bot").game = this;
    }

    updateScore(): void {
        let scoreTxt: cc.Label = this.node.getChildByName("scoreBar").getChildByName("score_txt").getComponent(cc.Label);
        scoreTxt.string = `${this.score}`;
    }

    updateTime(time: number): void {
        let timeRemaining: cc.Label = this.node.getChildByName("timeRemaining").getComponent(cc.Label);
        timeRemaining.string = `${Math.ceil(time)}`;
    }

    onTouchStart(event: cc.Event.EventTouch): void {
        console.log(event.getLocation());
    }
}
