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
export default class McController extends cc.Component {

    @property
    speed: number = 1;
    game: Game = null;
    canPickEgg: boolean = false;
    egg: cc.Component = null;


    moveLeft: boolean = false;
    moveRight: boolean = false;
    moveUp: boolean = false;
    moveDown: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        
    }

    update (dt: number) {
        if(this.moveUp) {
            if(this.node.y <= this.game.boxEdgeSize.y / 2) {
                this.node.y += this.speed * dt;
            }
        } else if(this.moveDown) {
            if(this.node.y >= -this.game.boxEdgeSize.y / 2) {
                this.node.y -= this.speed * dt;
            }
        }

        if (this.moveLeft) {
            if(this.node.x >= -this.game.boxEdgeSize.x / 2) {
                this.node.x -= this.speed * dt;
            }
        } else if (this.moveRight) {
            if(this.node.x <= this.game.boxEdgeSize.x / 2) {
                this.node.x += this.speed * dt;
            }
        }

    }

    onKeyDown (event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.up: {
                this.moveUp = true;
                this.moveDown = false;
                break;
            }
            case cc.macro.KEY.down: {
                this.moveUp = false;
                this.moveDown = true;
                break;
            }
            case cc.macro.KEY.left: {
                this.moveLeft = true;
                this.moveRight = false;
                break;
            }
            case cc.macro.KEY.right: {
                this.moveRight = true;
                this.moveLeft = false;
                break;
            }
        }
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.up: {
                this.moveUp = false;
                break;
            }
            case cc.macro.KEY.down: {
                this.moveDown = false;
                break;
            }
            case cc.macro.KEY.left: {
                this.moveLeft = false;
                break;
            }
            case cc.macro.KEY.right: {
                this.moveRight = false;
                break;
            }
        }
    }

    pickEggUp(): void {
        if(this.canPickEgg) {
            if(this.egg) {
                this.game.playerScoresArr[0]++;
                this.game.updateScore();
                this.egg.node.destroy();
                this.game.spawnNewEgg();
            }
        }
    }
}
