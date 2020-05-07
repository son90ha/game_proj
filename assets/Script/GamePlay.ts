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
import {ScreenStatus} from './Enums'
import Game from './Game';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {

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
    bot: cc.Node = null;
    timeToUpdate: number = 0.02;
    timeUpdateElapsed: number = 0.02;
    mcServerPos: cc.Vec2 = cc.v2(0, 0);
    ratioDelayServerTime: number = 1;
    distanceCharMove: cc.Vec2 = cc.v2(0, 0);
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
    }

    start () {

    }

    update (dt: number) {
        if(this.timeElapsed > 0) {
            this.timeElapsed -= dt;
            if (this.timeElapsed <= 0) {
							this.timeElapsed = 0;
                            ScreenMgr.getInstance().changeScreen(ScreenStatus.result_screen);
                            let resultScreen = ScreenMgr.getInstance().resultScreen.getComponent("ResultScreen");
							if (this.playerScoresArr[0] > this.playerScoresArr[1]) {
								resultScreen.label.string = "WIN";
							} else if (this.playerScoresArr[0] < this.playerScoresArr[1]) {
								resultScreen.label.string = "LOSS";
							} else if (this.playerScoresArr[0] === this.playerScoresArr[1]) {
								resultScreen.label.string = "DRAW";
							}
						}
            this.updateTime(this.timeElapsed);
        }

        if(this.timeUpdateElapsed <= 0) {
            this.updateMC(this.timeToUpdate);
            this.timeUpdateElapsed = this.timeToUpdate;
        }
        this.timeUpdateElapsed -= dt;
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
        this.mainChar.getComponent("MCController").gamePlay = this;
    }

    spawnBot(): void {
        this.bot = cc.instantiate(this.botPrefab);
        this.node.addChild(this.bot);
        this.bot.setPosition(cc.v2(0,0));
        this.bot.getComponent("Bot").game = this;
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

    updateMC(dt: number): void {
        // if(this.mainChar.x !== this.mcServerPos.x && this.mainChar.y !== this.mcServerPos.y) {
        // if(Math.round(this.mainChar.x) != this.mcServerPos.x || Math.round(this.mainChar.y) != this.mcServerPos.y) {
            // let mcController = this.mainChar.getComponent("MCController");
            // if(mcController.moveUp) {
            //     if(mcController.node.y <= this.boxEdgeSize.y / 2) {
            //         mcController.node.y += mcController.speed * dt;
            //     }
            // } else if(mcController.moveDown) {
            //     if(mcController.node.y >= -this.boxEdgeSize.y / 2) {
            //         mcController.node.y -= mcController.speed * dt;
            //     }
            // }
    
            // if (mcController.moveLeft) {
            //     if(mcController.node.x >= -this.boxEdgeSize.x / 2) {
            //         mcController.node.x -= mcController.speed * dt;
            //     }
            // } else if (mcController.moveRight) {
            //     if(mcController.node.x <= this.boxEdgeSize.x / 2) {
            //         mcController.node.x += mcController.speed * dt;
            //     }
            // }
        // }
        // console.log(`mainchar Pos: ${Math.round(this.mainChar.x)}, ${Math.round(this.mainChar.y)}`);
        // console.log(`serverPos: ${this.mcServerPos.x}, ${this.mcServerPos.y}`);
        // if(Math.round(this.mainChar.x) != this.mcServerPos.x || Math.round(this.mainChar.y) != this.mcServerPos.y) {
        //     console.log("move");
        //     this.mainChar.x += this.distanceCharMove.x;
        //     this.mainChar.y += this.distanceCharMove.y;
        // }
    }

    serverAlreadyUpdated() {
        // let jsonServerData: any = JSON.parse(Game.getInstance().getServerSim().serverData);
        // let mcData = jsonServerData.charInfo[0];
        // this.mainChar.x = this.mcServerPos.x;
        // this.mainChar.y = this.mcServerPos.y;
        // this.mcServerPos.x = mcData.x;
        // this.mcServerPos.y = mcData.y;
        // // this.ratioDelayServerTime = Game.getInstance().getTimeServerUpdate() / this.timeToUpdate;
        // this.ratioDelayServerTime = 10;
        // //console.log(this.ratioDelayServerTime);
        // this.distanceCharMove.x = (this.mcServerPos.x - this.mainChar.x) / this.ratioDelayServerTime;
        // this.distanceCharMove.y = (this.mcServerPos.y - this.mainChar.y) / this.ratioDelayServerTime;
    }

    reset(): void {
        this.playerScoresArr[0] = 0;
        this.playerScoresArr[1] = 0;
        this.timeElapsed = this.timeLimit;
        this.updateTime(this.timeLimit);
        this.updateScore();
        this.mainChar.setPosition(cc.v2(0,0));
        this.bot.setPosition(cc.v2(0,0));
    }
}
