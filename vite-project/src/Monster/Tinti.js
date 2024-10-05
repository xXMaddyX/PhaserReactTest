import Phaser from "phaser";
import Player from "../player/Player";
import { TintiIdle, TintiIdleN } from "../assetLoader/AssetLoader";

const KEY_TINTI_IDLE = "TintiIdle";
const KEY_TINTI_IDLE_ANIM = "TintiIdleAnim";

const PATROL_DISTANCE = 2000;
const PLAYER_DEDECTION_RANGE = 350;
const TINTI_SPEED = 100;

export default class TintiClass {
    constructor(scene, player) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        /**@type {Player} */
        this.player = player;
        this.onPatrol = true;
        this.isChasingPlayer = false;
        this.isToCloseToSpawnPoint = false;
        this.patrolDirection = 1;
        this.spawnX = 150;
        this.spawnY = 530;
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEY_TINTI_IDLE)) scene.load.spritesheet(KEY_TINTI_IDLE, [TintiIdle, TintiIdleN], {
            frameWidth: 46, frameHeight: 54,
        });
    };

    initAnimations() {
        if (!this.scene.anims.exists(KEY_TINTI_IDLE_ANIM)) {
            this.scene.anims.create({
                key: KEY_TINTI_IDLE_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_TINTI_IDLE, {
                    start: 0,
                    end: 1
                }),
                frameRate: 3,
                repeat: -1
            });
        };
    };

    create(x, y, depth, scale) {
        this.initAnimations();
        this.tinti = this.scene.physics.add.sprite(x, y, KEY_TINTI_IDLE).setDepth(depth).setScale(scale).setPipeline("Light2D");
        this.tinti.anims.play(KEY_TINTI_IDLE_ANIM);

        this.tintiLight = this.scene.lights.addLight(this.tinti.x, this.tinti.y);
        this.tintiLight.setIntensity(0.5);

        this.startX = x;
        this.startY = y;
        this.endX = x + PATROL_DISTANCE;
        this.tinti.setVelocityX(this.patrolDirection * TINTI_SPEED);
    };

    directionHandler() {
        if (this.patrolDirection === 1) {
            this.tinti.flipX = true
        };
        if (this.patrolDirection === -1) {
            this.tinti.flipX = false;
        };
    };

    tintiLightHandler() {
        this.tintiLight.x = this.tinti.x;
        this.tintiLight.y = this.tinti.y;
    };

    patrol() {
        if (this.patrolDirection === 1 && this.tinti.x >= this.endX) {
            this.patrolDirection = -1;
        } else if (this.patrolDirection === -1 && this.tinti.x <= this.startX) {
            this.patrolDirection = 1;
        }

        this.tinti.setVelocityX(this.patrolDirection * TINTI_SPEED);

        if (this.tinti.y !== this.startY) {
            let deltaY = this.startY - this.tinti.y;
            this.tinti.setVelocityY(Math.sign(deltaY) * TINTI_SPEED);
            if (Math.abs(deltaY) < 1) {
                this.tinti.setVelocityY(0);
                this.tinti.y = this.startY;
            }
        } else {
            this.tinti.setVelocityY(0);
        }
    };

    chaseStatusHandler(distanceToPlayer) {
        if (distanceToPlayer < PLAYER_DEDECTION_RANGE && !this.isToCloseToSpawnPoint) {
            this.isChasingPlayer = true;
        } else {
            this.isChasingPlayer = false;
        };
    };

    checkIfToCloseToPlayerSpawn() {
        let distanceToSpawn = Phaser.Math.Distance.Between(this.tinti.x, this.tinti.y, this.spawnX, this.spawnY);
        if (distanceToSpawn < 400) {
            this.isToCloseToSpawnPoint = true
        } else {
            this.isToCloseToSpawnPoint = false
        }
    }

    update(time, delta) {
        let distanceToPlayer = Phaser.Math.Distance.Between(
            this.tinti.x, this.tinti.y,
            this.player.uboot.x, this.player.uboot.y
        );
        this.checkIfToCloseToPlayerSpawn();
        this.chaseStatusHandler(distanceToPlayer);
        this.directionHandler();
        this.tintiLightHandler();
        if (this.isChasingPlayer) {
            this.scene.physics.moveToObject(this.tinti, this.player.uboot, TINTI_SPEED);
        }
        if (!this.isChasingPlayer || this.isToCloseToSpawnPoint) {
            this.patrol()
        };
    };
};
