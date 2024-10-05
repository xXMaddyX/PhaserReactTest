import Phaser from "phaser";
import Player from "../player/Player";
import { KEYS } from "./collectablesConfig";
import {
    Chest1,
    Chest1N,
} from '../assetLoader/AssetLoader.js';

export default class Collectables {
    constructor(scene, player) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        /**@type {Player} */
        this.player = player;
        this.isCollected = false;
    };

    static loadSprites(scene) {
        if(!scene.textures.exists(KEYS.KEY_SCHATZTRUE)) scene.load.spritesheet(KEYS.KEY_SCHATZTRUE, [Chest1, Chest1N], {
            frameWidth: 48, frameHeight: 31
        });
    };

    intitAnimations({animKey, startFrame, endFrame, frameRate, repeat}) {
        this.animkey = animKey;
        if (!this.scene.anims.exists(this.animkey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(this.animkey, {
                    start: startFrame,
                    end: endFrame,
                }),
                frameRate: frameRate,
                repeat: repeat
            });
        };
    };

    create({x, y, itemKey, depth, scale}, animConfig) {
        this.originX = x
        this.originY = y
        this.item = this.scene.physics.add.sprite(x, y, itemKey).setPipeline("Light2D")
        .setPipeline("Light2D")
        .setDepth(depth)
        .setScale(scale)
        .setGravityY(200)
        .setBodySize(50)
        .setOffset(0)

        //Anim Config
        this.intitAnimations(animConfig)
        this.item.anims.play(this.animkey)
    };
    
    takeItem() {
        this.setCollectedStatus();
        this.player.ubootGreifer.isCarrying = true;
    };

    setItemToPlayer() {
        this.item.x = this.player.ubootGreifer.kran.x;
        this.item.y = this.player.ubootGreifer.kran.y + 70;
    };

    setCollectedStatus() {
        this.isCollected = true;
        this.item.setGravityY(0);
        this.player.ubootGreifer.isClosed = true;
    };

    update(time, delta) {
        if (this.item && this.item.body) {
            if (this.isCollected) {
                this.setItemToPlayer();
            };
            if (this.player.ubootGreifer.isUp) {
                this.isCollected = false;
                this.item.setGravityY(100)
            }
            if (this.item.y >= 3240) {
                this.item.x = this.originX
                this.item.y = this.originY
            }
        };
    };
};