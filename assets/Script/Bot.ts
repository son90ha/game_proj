// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from './Game'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bot extends cc.Component {

    @property
    speed: number = 0;
    game: Game = null;
    isChaseEgg: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt: number) {
        if(this.game.node.getChildByName("egg")) {
            let eggPos: cc.Vec2 = this.game.node.getChildByName("egg").getPosition();
            let botPos: cc.Vec2 = this.node.getPosition();
            let directPos: cc.Vec2 = cc.v2();
            directPos.x = eggPos.x - botPos.x >= 0 ? 1 : -1;
            directPos.y = eggPos.y - botPos.y >= 0 ? 1 : -1;
            this.node.x = this.node.x + directPos.x * this.speed * dt;
            this.node.y = this.node.y + directPos.y * this.speed * dt;
        }
    }

    pickEggUp(egg: any): void {
        if(egg) {
            this.game.playerScoresArr[1]++;
            this.game.updateScore();
            egg.node.destroy();
            this.game.spawnNewEgg();
        }
    }

}
