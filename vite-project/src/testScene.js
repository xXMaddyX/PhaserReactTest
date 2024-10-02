import Phaser from "phaser";
import ubootSprite from "../src/assets/Uboot.png";

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("SceneLvL1")
    }

    initScene() {

    }

    preload() {
        this.load.spritesheet("uboot", ubootSprite, {
            frameHeight: 93, frameWidth: 125
        });
    }

    create() {
        this.anims.create({
            key: "uboot",
            frames: this.anims.generateFrameNumbers("uboot", {
                start: 0,
                end: 6
            }),
            frameRate: 5,
            repeat: -1
        })
        this.uboot = this.physics.add.sprite(100, 100, "uboot")
        this.uboot.setGravityY(-200)
    }

    update(time, delta) {

    }
}