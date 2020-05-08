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

interface Egg {
    id: number;
    node: cc.Node;
}

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

    @property({
        type: cc.Prefab
    })
    scoreTxt: cc.Prefab = null;

    @property
    timeLimit: number = 0;
    boxEdgeSize: cc.Vec2 = cc.v2();
    timeElapsed: number = 0;
    mcScore: number = 0;
    botScoresArr: number[] = [];
    mainChar: cc.Node = null;
    bot: cc.Node = null;
    bots: cc.Node[] = [];
    remoteBot: cc.Node = null;
    remoteBots: cc.Node[] = [];
    timeToUpdate: number = 0.02;
    timeUpdateElapsed: number = 0.02;
    mcServerPos: cc.Vec2 = cc.v2(0, 0);
    botServerPos: cc.Vec2[] = [];
    // botServerPos: cc.Vec2 = cc.v2(0, 0);
    prevBotPos: cc.Vec2[] = [];
    // prevBotPos: cc.Vec2 = cc.v2(0, 0)
    ratioDelayServerTime: number = 1;
    // distanceCharMove: cc.Vec2 = cc.v2(0, 0);
    eggs: Egg[] = [];
    predictDirectPos: cc.Vec2[] = [];
    // predictDirectPos: cc.Vec2 = cc.v2(0, 0);
    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.timeElapsed = this.timeLimit;
        this.boxEdgeSize = cc.v2(this.node.getChildByName("boxEdge").width, this.node.getChildByName("boxEdge").height);
        Game.getInstance().getServerSim().initData();
        this.updateTime(this.timeLimit);
        this.spawnMC();
        // this.spawnNewEgg();
        this.spawnBot();
        this.spawnRemoteBot();
        this.updateScore();
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
                            let botMaxScore: number = Math.max(...this.botScoresArr);
                            let isYouWin: boolean = this.mcScore >= botMaxScore;
                            if(isYouWin) {
                                resultScreen.label.string = "YOU WIN - Score = " + this.mcScore;
                            } else {
                                resultScreen.label.string = `BOT${this.botScoresArr.indexOf(botMaxScore)} WIN - Score = ${botMaxScore}`;
                            }

							// if (this.playerScoresArr[0] > this.playerScoresArr[1]) {
							// 	resultScreen.label.string = "WIN";
							// } else if (this.playerScoresArr[0] < this.playerScoresArr[1]) {
							// 	resultScreen.label.string = "LOSS";
							// } else if (this.playerScoresArr[0] === this.playerScoresArr[1]) {
							// 	resultScreen.label.string = "DRAW";
							// }
						}
            this.updateTime(this.timeElapsed);
        }
        this.updateRemoteBot(dt);
        if(this.timeUpdateElapsed <= 0) {
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
        // console.log(`boxEdgeSize: ${this.boxEdgeSize}`);
        return cc.v2(randX, randY);
    }

    spawnMC(): void {
        let serverData: string = Game.getInstance().getServerData();
        let jsonData: any = JSON.parse(serverData);
        let mcInfo: any = jsonData.charInfo.find((e: { id: string; }) => e.id == "mc");
        this.mainChar = cc.instantiate(this.mcPrefab);
        this.node.addChild(this.mainChar);
        this.mainChar.setPosition(cc.v2(mcInfo.x,mcInfo.y));
        this.mainChar.getComponent("MCController").gamePlay = this;

        let scoreTxt: cc.Node = cc.instantiate(this.scoreTxt);
        scoreTxt.name = "mc_score";
        scoreTxt.getComponent(cc.Label).string = `You: ${this.mcScore}`;
        this.node.getChildByName("scoreBar").addChild(scoreTxt);
    }

    spawnBot(): void {
        let serverData: string = Game.getInstance().getServerData();
        let jsonData: any = JSON.parse(serverData);
        for(let e of jsonData.charInfo) {
            if(e.id == "bot") {
                this.bots[e.botID] = cc.instantiate(this.botPrefab);
                this.node.addChild(this.bots[e.botID]);
                this.bots[e.botID].setPosition(cc.v2(e.x,e.y));
                this.bots[e.botID].getComponent("Bot").gamePlay = this;
                this.bots[e.botID].getComponent("Bot").botID = e.botID;
                this.bots[e.botID].opacity = 100;
                this.botScoresArr[e.botID] = e.score;

                let scoreTxt: cc.Node = cc.instantiate(this.scoreTxt);
                scoreTxt.name = `${e.botID}`;
                scoreTxt.getComponent(cc.Label).string = `BOT${e.botID}: ${this.botScoresArr[e.botID]}`;
                this.node.getChildByName("scoreBar").addChild(scoreTxt);
            }
        }
        // this.bot = cc.instantiate(this.botPrefab);
        // this.node.addChild(this.bot);
        // this.bot.setPosition(cc.v2(botInfo.x,botInfo.y));
        // this.bot.getComponent("Bot").gamePlay = this;
        // this.bot.opacity = 0;
    }

    updateScore(): void {
        //let scoreTxt1: cc.Label = this.node.getChildByName("scoreBar").getChildByName("score_txt_1").getComponent(cc.Label);
        this.node.getChildByName("scoreBar").getChildByName("mc_score").getComponent(cc.Label).string = `You: ${this.mcScore}`;
        for(let botScore of this.botScoresArr) {
            let index = this.botScoresArr.indexOf(botScore);
            this.node.getChildByName("scoreBar").getChildByName(`${index}`).getComponent(cc.Label).string = `BOT${index}: ${this.botScoresArr[index]}`;
        }
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

    updateEggs(dt: number): void {
        let data = Game.getInstance().getServerData();
        let jsonData = JSON.parse(data);
        let eggsData = jsonData["eggs"];
        // console.log("eggdata: " + JSON.stringify(eggsData));
        for(let eggData of eggsData) {
            if(!this.eggs.some(egg => {
                return egg.id == eggData.id;
            })){
                let newEgg: cc.Node = cc.instantiate(this.eggPrefab);
                newEgg.getComponent("Touch").mainChar = this.mainChar;
                newEgg.getComponent("Touch").id = eggData.id;
                let egg: Egg = {"id": 0, "node": newEgg};
                egg.id = eggData.id;
                this.node.addChild(egg.node);
                egg.node.x = eggData.x;
                egg.node.y = eggData.y;
                this.eggs.push(egg);
            }
        }

        for(let egg of this.eggs) {
            if(!eggsData.some((e => e.id == egg.id))) {
                egg.node.destroy();
                egg.node = null;
            }
        }

        this.eggs = this.eggs.filter((e) => e.node != null);
    }

    serverAlreadyUpdated(): void {
        let jsonServerData: any = JSON.parse(Game.getInstance().getServerSim().serverData);
        for(let char of jsonServerData.charInfo) {
            if(char.id == "mc") {
                // console.log(char.score);
                this.mcScore = char.score;
            } else if (char.id == "bot") {
                // this.playerScoresArr[1] = char.score;
                this.prevBotPos[char.botID] = cc.v2(this.botServerPos[char.botID]);
                this.botServerPos[char.botID] = cc.v2(char.x, char.y);
                // console.log("[serverAlreadyUpdated] - " + "x =" + this.botServerPos[char.botID].x + ",y = " + this.botServerPos[char.botID].y + ",botID = " + char.botID);
                this.predictDirectPos[char.botID] = cc.v2(this.botServerPos[char.botID].x + (this.botServerPos[char.botID].x - this.prevBotPos[char.botID].x), this.botServerPos[char.botID].y + (this.botServerPos[char.botID].y - this.prevBotPos[char.botID].y));
                this.botScoresArr[char.botID] = char.score;
                // this.remoteBot.x = char.x;
                // this.remoteBot.y = char.y;
            }
        }
        this.updateEggs(0);
        this.updateScore();
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

    spawnRemoteBot(): void {
        let jsonServerData: any = JSON.parse(Game.getInstance().getServerSim().serverData);
        for(let char of jsonServerData.charInfo) {
            if (char.id == "bot") {
                this.remoteBots[char.botID] = cc.instantiate(this.botPrefab);
                this.remoteBots[char.botID].opacity = 255;
                this.remoteBots[char.botID].group = "default";
                this.remoteBots[char.botID].removeComponent("Bot");
                this.node.addChild(this.remoteBots[char.botID]);
                this.remoteBots[char.botID].setPosition(cc.v2(char.x,char.y));
                this.predictDirectPos[char.botID] = cc.v2(char.x,char.y);
            }
        }
    }

    updateRemoteBot(dt: number): void {
        for(let remoteBot of this.remoteBots) {
            let remoteBotPos: cc.Vec2 = remoteBot.getPosition();
            let directPos: cc.Vec2 = cc.v2();
            directPos.x = this.predictDirectPos[this.remoteBots.indexOf(remoteBot)].x - remoteBotPos.x >= 0 ? 1 : -1;
            directPos.y = this.predictDirectPos[this.remoteBots.indexOf(remoteBot)].y - remoteBotPos.y >= 0 ? 1 : -1;        
            let speed: number = 100;
            if(this.predictDirectPos[this.remoteBots.indexOf(remoteBot)].sub(remoteBotPos).mag() > 100) {
                speed = 200;
            } else if (this.predictDirectPos[this.remoteBots.indexOf(remoteBot)].sub(remoteBotPos).mag() > 50) {
                speed = 150;
            } else if (this.predictDirectPos[this.remoteBots.indexOf(remoteBot)].sub(remoteBotPos).mag() > 20) {
                speed = 120;
            } else {
                speed = 100;
            }
            remoteBot.x = remoteBot.x + directPos.x * speed * dt;
            remoteBot.y = remoteBot.y + directPos.y * speed * dt;
        }

        // let remoteBotPos: cc.Vec2 = this.remoteBot.getPosition();
        // // let predictDirectPos: cc.Vec2 = cc.v2(this.botServerPos.x + (this.botServerPos.x - this.prevBotPos.x), this.botServerPos.y + (this.botServerPos.y - this.prevBotPos.y));
        // // predictDirectPos.mulSelf(0.5);
        // let directPos: cc.Vec2 = cc.v2();
        // directPos.x = this.predictDirectPos.x - remoteBotPos.x >= 0 ? 1 : -1;
        // directPos.y = this.predictDirectPos.y - remoteBotPos.y >= 0 ? 1 : -1;        
        // // directPos.x = this.botServerPos.x - remoteBotPos.x >= 0 ? 1 : -1;
        // // directPos.y = this.botServerPos.y - remoteBotPos.y >= 0 ? 1 : -1;
        // let speed: number = 100;
        // if(this.predictDirectPos.sub(remoteBotPos).mag() > 100) {
        //     // this.remoteBot.x = this.botServerPos.x;g
        //     // this.remoteBot.y = this.botServerPos.y;
        //     speed = 200;
        // } else if (this.predictDirectPos.sub(remoteBotPos).mag() > 50) {
        //     speed = 150;
        // } else if (this.predictDirectPos.sub(remoteBotPos).mag() > 20) {
        //     speed = 120;
        // } else {
        //     speed = 100;
        //     // this.remoteBot.x = this.remoteBot.x + directPos.x * speed * dt;
        //     // this.remoteBot.y = this.remoteBot.y + directPos.y * speed * dt;
        // }
        // this.remoteBot.x = this.remoteBot.x + directPos.x * speed * dt;
        // this.remoteBot.y = this.remoteBot.y + directPos.y * speed * dt;
        // // this.remoteBot.x = this.botServerPos.x;
        // // this.remoteBot.y = this.botServerPos.y;
        // // this.remoteBot.x = predictDirectPos.x;
        // // this.remoteBot.y = predictDirectPos.y;
    }
    
    reset(): void {
        this.timeElapsed = this.timeLimit;
        this.updateTime(this.timeLimit);
        Game.getInstance().getServerSim().initData();

        //reset score
        this.mcScore = 0;
        this.botScoresArr = this.botScoresArr.map(score => score * 0);
        this.updateScore();
        // this.mainChar.setPosition(cc.v2(0,0));
        // this.bot.setPosition(cc.v2(0,0));
    }
}
