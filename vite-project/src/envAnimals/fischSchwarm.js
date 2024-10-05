import Phaser from "phaser";
import {
    FischSchwarm,
    FischSchwarmN
} from "../assetLoader/AssetLoader"
import { 
    KEYS 
} from "./fischSchwarmConfig";

export default class FischSchwarmClass {
    constructor(scene) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        this.fischSchwarmPool = [];
        this.fischSpeed = 50;
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEYS.KEY_FISCHSCHWARM)) {
            scene.load.spritesheet(KEYS.KEY_FISCHSCHWARM, [FischSchwarm, FischSchwarmN], {
                frameWidth: 190, frameHeight: 112
            });
        };
    };

    initAnimation() {
        if (!this.scene.anims.exists(KEYS.KEY_FISCHSCHWARM_MOVING)) {
            this.scene.anims.create({
                key: KEYS.KEY_FISCHSCHWARM_MOVING,
                frames: this.scene.anims.generateFrameNumbers(KEYS.KEY_FISCHSCHWARM, {
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
        if (distanceToOrigX < 50 && distanceToOrigX < 1200 && !fisch.movingRight) {
            fisch.setVelocityX(-80)
            fisch.flipX = false;
        }
        if (distanceToOrigX > 1200 && distanceToOrigX > 50) {
            fisch.setVelocityX(80)
            fisch.flipX = true;
        }
    }

    create() {
        this.initAnimation();
        let fischCounter = 5;
        for (let i = 0; i < fischCounter; i++) {
            let delay = Phaser.Math.Between(500, 3000)
            this.scene.time.delayedCall(delay, () => {
                let X = Phaser.Math.Between(1200, 3540);
                let Y = Phaser.Math.Between(700, 3140);
                let fischSchwarm = this.scene.physics.add.sprite(X, Y, null).setScale(1).setDepth(2).setPipeline("Light2D");
                fischSchwarm.anims.play(KEYS.KEY_FISCHSCHWARM_MOVING);
                fischSchwarm.setVelocityX(-80);
                fischSchwarm.startX = X;
                fischSchwarm.movingLeft = true;
                fischSchwarm.movingRight = false;
                this.fischSchwarmPool.push(fischSchwarm);
            })
        };
    };

    update(time, delta) {
        this.fischSchwarmPool.forEach(fisch => {
            this.movementHandler(fisch)
        })
    };
};