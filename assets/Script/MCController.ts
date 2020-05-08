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
export default class McController extends cc.Component {

    @property
    speed: number = 1;

    @property({
        type: cc.Prefab
    })
    trailParticle : cc.Prefab = null;

    gamePlay: GamePlay = null;
    eggsCanPick: number[] = [];
    egg: cc.Component = null;


    moveLeft: boolean = false;
    moveRight: boolean = false;
    moveUp: boolean = false;
    moveDown: boolean = false;
    isPickingEgg: boolean = false;
    pickEggId = undefined;
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
        if(!Game.getInstance().getScreenMgr().isActionPhase()) {
            return;
        }
        // let x: number = 0, y:number = 0;
        // if(this.moveDown) {
        //     y = -1;
        // } else if(this.moveUp) {
        //     y = 1;
        // }

        // if(this.moveLeft) {
        //     x = -1;
        // } else if(this.moveRight) {
        //     x = 1;
        // }
        // console.log("[MCController] - update - canPickEgg = " + this.eggsCanPick);
        this.updateEggCanPickEffect(dt);
        if(this.moveUp) {
            if(this.node.y <= this.gamePlay.boxEdgeSize.y / 2) {
                this.node.y += this.speed * dt;
            }
        } else if(this.moveDown) {
            if(this.node.y >= -this.gamePlay.boxEdgeSize.y / 2) {
                this.node.y -= this.speed * dt;
            }
        }

        if (this.moveLeft) {
            if(this.node.x >= -this.gamePlay.boxEdgeSize.x / 2) {
                this.node.x -= this.speed * dt;
            }
        } else if (this.moveRight) {
            if(this.node.x <= this.gamePlay.boxEdgeSize.x / 2) {
                this.node.x += this.speed * dt;
            }
        }
        // console.log(`[MCController] - update - this.isPickingEgg = ${this.isPickingEgg}`);

        // Add particles
        let newParticles = cc.instantiate(this.trailParticle);
        newParticles.setPosition(this.node.getPosition());
        Game.getInstance().getGamePlay().node.getChildByName("background").addChild(newParticles);

        let mcObj = Game.getInstance().createCharObj("mc", this.node.x, this.node.y, this.isPickingEgg, this.gamePlay.mcScore, this.pickEggId);
        Game.getInstance().postToServer(JSON.stringify(mcObj));
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

    pickEggUp(id: number): void {
        // console.log("[MCController] - `pickEggUp` " + id);
        if(this.eggsCanPick.indexOf(id) != -1) {
            // if(this.egg) {
            //     this.game.playerScoresArr[0]++;
            //     this.game.updateScore();
            //     this.egg.node.destroy();
            //     this.game.spawnNewEgg();
            // }
            this.isPickingEgg = true;
            this.pickEggId = id;
            this.eggsCanPick.splice(this.eggsCanPick.indexOf(id), 1);
        }
    }

    addEggsCanPick(other: any, self: any) {
        // console.log("[MCController] - addEggsCanPick");
        for(let e of this.gamePlay.eggs) {
            if(e.node == other.node) {
                // console.log("[MCController] - for loop");
                if(!this.eggsCanPick.some((egg) => {
                    return egg == e.id;
                })) {
                    this.eggsCanPick.push(e.id);
                    break;
                }
            }
        }
    }

    removeEggsCanPick(other: any, self: any) {
        for(let e of this.gamePlay.eggs) {
            if(e.node === other.node) {
                if(this.eggsCanPick.some((egg) => {
                    return egg == e.id;
                })) {
                    this.eggsCanPick.splice(this.eggsCanPick.indexOf(e.id), 1);
                    e.node.opacity = 255;
                    e.node.setScale(cc.v2(0.2,0.2));
                    break;
                }
            }
        }
    }

    updateEggCanPickEffect(dt: number){
        for(let id of this.eggsCanPick) {
            for(let egg of this.gamePlay.eggs) {
                if(id == egg.id) {
                    egg.node.opacity -= 1500 * dt;
                    if(egg.node.opacity <= 0) {
                        egg.node.opacity = 255;
                    }
                    
                    let curScale: cc.Vec2 = cc.v2(0, 0);
                    egg.node.getScale(curScale);
                    curScale.x = curScale.x + 0.5 * dt;
                    curScale.y = curScale.x + 0.5 * dt;
                    if(curScale.x >= 0.3 ) {
                        curScale.x = 0.2;
                        curScale.y = 0.2;
                    }
                    // console.log("curScale = " + curScale);
                    egg.node.setScale(curScale);
                }
            }
        }
    }
}
