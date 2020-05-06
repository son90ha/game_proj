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
    timeElapsed: number = 0;
    playerScoresArr: number[] = [];
    mainChar: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.playerScoresArr[0] = 0;
        this.playerScoresArr[1] = 0;
        this.timeElapsed = this.timeLimit;
        this.boxEdgeSize = cc.v2(this.node.getChildByName("boxEdge").width, this.node.getChildByName("boxEdge").height);
        this.updateTime(this.timeLimit);
        this.updateScore();
        this.spawnMC();
        this.spawnNewEgg();
        this.spawnBot();

        cc.director.preloadScene("result_screen");
    }

    start () {

    }

    update (dt: number) {
        if(this.timeElapsed > 0) {
            this.timeElapsed -= dt;
            if(this.timeElapsed <= 0) {
                this.timeElapsed = 0;
                let tempScoreArr: number[] = this.playerScoresArr.slice();
                cc.director.loadScene("result_screen", () => {
                    let resultNode: cc.Node = cc.director.getScene().getChildByName("Canvas");
                    let resultScreen = resultNode.getComponent("ResultScreen");
                    if(tempScoreArr[0] > tempScoreArr[1]) {
                        resultScreen.label.string = "WIN";
                    } else if (tempScoreArr[0] < tempScoreArr[1]) {
                        resultScreen.label.string = "LOSS";
                    } else if (tempScoreArr[0] === tempScoreArr[1]) {
                        resultScreen.label.string = "DRAW";
                    }
                });
            }
            this.updateTime(this.timeElapsed);
        }
    }

    onDestroy(): void {
    }

    spawnNewEgg(): void {
        let newEgg: cc.Node = cc.instantiate(this.eggPrefab);
        this.node.addChild(newEgg);
        newEgg.setPosition(this.createNewEggPos());
        newEgg.getComponent("Touch").mainChar = this.mainChar;
    }

    createNewEggPos(): cc.Vec2 {
        let randX: number = Math.random() * this.boxEdgeSize.x - this.boxEdgeSize.x / 2;
        let randY: number = Math.random() * this.boxEdgeSize.y - this.boxEdgeSize.y / 2;
        return cc.v2(randX, randY);
    }

    spawnMC(): void {
        this.mainChar = cc.instantiate(this.mcPrefab);
        this.node.addChild(this.mainChar);
        this.mainChar.setPosition(cc.v2(0,0));
        this.mainChar.getComponent("MCController").game = this;
    }

    spawnBot(): void {
        let newBot: cc.Node = cc.instantiate(this.botPrefab);
        this.node.addChild(newBot);
        newBot.setPosition(cc.v2(0,0));
        newBot.getComponent("Bot").game = this;
    }

    updateScore(): void {
        let scoreTxt1: cc.Label = this.node.getChildByName("scoreBar").getChildByName("score_txt_1").getComponent(cc.Label);
        scoreTxt1.string = `You: ${this.playerScoresArr[0]}`;
        let scoreTxt2: cc.Label = this.node.getChildByName("scoreBar").getChildByName("score_txt_2").getComponent(cc.Label);
        scoreTxt2.string = `Bot: ${this.playerScoresArr[1]}`;
    }

    updateTime(time: number): void {
        let timeRemaining: cc.Label = this.node.getChildByName("timeRemaining").getComponent(cc.Label);
        timeRemaining.string = `${Math.ceil(time)}`;
    }
}
