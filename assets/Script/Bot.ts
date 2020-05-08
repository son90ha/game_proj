// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GamePlay from './GamePlay'
import Game from './Game';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bot extends cc.Component {

    @property
    speed: number = 0;
    gamePlay: GamePlay = null;
    isChaseEgg: boolean = false;
    chaseEggNode: cc.Node = null;
    chaseEggPos: cc.Vec2 = cc.v2(0,0);
    isPickingEgg: boolean = false;
    pickEggId: number = undefined;
    botID: number = undefined;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt: number) {
        if(!Game.getInstance().getScreenMgr().isActionPhase()) {
            return;
        }

        if(!this.chaseEggNode) {
            this.renewChaseEgg();
        }

        if(this.chaseEggNode != null && this.chaseEggNode != undefined)  {
            if(this.chaseEggNode.isValid) {
                let eggPos: cc.Vec2 = this.chaseEggPos;
                let botPos: cc.Vec2 = this.node.getPosition();
                let directPos: cc.Vec2 = cc.v2();
                directPos.x = eggPos.x - botPos.x >= 0 ? 1 : -1;
                directPos.y = eggPos.y - botPos.y >= 0 ? 1 : -1;
                this.node.x = this.node.x + directPos.x * this.speed * dt;
                this.node.y = this.node.y + directPos.y * this.speed * dt;
            } else {
                this.renewChaseEgg();
            }
        }

        // if(this.gamePlay.node.getChildByName("egg")) {
        //     let eggPos: cc.Vec2 = this.gamePlay.node.getChildByName("egg").getPosition();
        //     let botPos: cc.Vec2 = this.node.getPosition();
        //     let directPos: cc.Vec2 = cc.v2();
        //     directPos.x = eggPos.x - botPos.x >= 0 ? 1 : -1;
        //     directPos.y = eggPos.y - botPos.y >= 0 ? 1 : -1;
        //     this.node.x = this.node.x + directPos.x * this.speed * dt;
        //     this.node.y = this.node.y + directPos.y * this.speed * dt;
        // }
        let botObj = Game.getInstance().createCharObj("bot", this.node.x, this.node.y, this.isPickingEgg, 0, this.pickEggId, this.botID);
        // console.log("[Bot Update] - " + JSON.stringify(botObj));
        Game.getInstance().postToServer(JSON.stringify(botObj));
    }

    pickEggUp(egg: any): void {
        this.isPickingEgg = true;
        for(let e of this.gamePlay.eggs) {
            if(e.node === egg.node) {
                // console.log("e.node === egg.node");
                this.pickEggId = e.id;
                break;
            }
        }
    }

    renewChaseEgg(): void {
            if(this.gamePlay.eggs.length > 0) {
                let randomIndex = Math.round((Math.random() * this.gamePlay.eggs.length) - 1);
                if(this.gamePlay.eggs[randomIndex]) {
                    this.chaseEggNode = this.gamePlay.eggs[randomIndex].node;
                    this.chaseEggPos = this.chaseEggNode.getPosition();
                }
            }
        }
}
