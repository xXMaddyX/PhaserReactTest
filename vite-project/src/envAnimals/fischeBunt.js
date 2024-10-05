import Phaser, { Physics } from "phaser";
import { 
    FischBunt,
    FischBuntN, 
} from "../assetLoader/AssetLoader";

import { 
    KEYS
} from "./fischeBuntConfig";

export default class FuscheBuntClass {
    constructor(scene) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        this.fischeBuntPool = [];
        this.fischSpeed = 50;
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEYS.KEY_FISCHEBUNT)) {
            scene.load.spritesheet(KEYS.KEY_FISCHEBUNT, [FischBunt, FischBuntN], {
                frameWidth: 43, frameHeight: 43
            });
        };
    };

    initAnimation() {
        if (!this.scene.anims.exists(KEYS.KEY_FISCHEBUNT_MOVING)) {
            this.scene.anims.create({
                key: KEYS.KEY_FISCHEBUNT_MOVING,
                frames: this.scene.anims.generateFrameNumbers(KEYS.KEY_FISCHEBUNT, {
                    start:0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
    };

    movementHandler(fisch) {
        let distanceToOrigX = Phaser.Math.Distance.Between(fisch.startX, 0, fisch.x, 0)
        if (distanceToOrigX < 50 && distanceToOrigX < 500 && !fisch.movingRight) {
            fisch.setVelocityX(-80)
            fisch.flipX = false;
        }
        if (distanceToOrigX > 500 && distanceToOrigX > 50) {
            fisch.setVelocityX(80)
            fisch.flipX = true;
        }
    }

    create() {
        this.initAnimation();
        let fischCounter = 15;
        for (let i = 0; i < fischCounter; i++) {
            let delay = Phaser.Math.Between(500, 3000)
            this.scene.time.delayedCall(delay, () => {
                let X = Phaser.Math.Between(500, 3840);
                let Y = Phaser.Math.Between(700, 3140);
                let fischeBunt = this.scene.physics.add.sprite(X, Y, null).setScale(1.5).setDepth(2).setPipeline("Light2D");
                fischeBunt.anims.play(KEYS.KEY_FISCHEBUNT_MOVING);
                fischeBunt.setVelocityX(-80);
                fischeBunt.startX = X;
                fischeBunt.movingLeft = true;
                fischeBunt.movingRight = false;
                this.fischeBuntPool.push(fischeBunt);
            })
        };
    };

    update(time, delta) {
        this.fischeBuntPool.forEach(fisch => {
            this.movementHandler(fisch)
        })
    };
};