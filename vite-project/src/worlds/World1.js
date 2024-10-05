import Phaser from "phaser";
import {
    KEYS,
    World1Config,
    calcBackPositionX,
} from "./World1Config.js";
import {
    Himmel,
    Wolken,
    Boden,
    BodenN,
    SurfaceSea,
    SurfaceSeaN,
    MiddelSea,
    MiddelSeaN,
    DeepSea,
    DeepSeaN,
    ExtreamDeepSea,
    ExtreamDeepSeaN,
    SeaWeed,
    SeaWeedN,
    WaveFront,
    WaveBack,
    BubblesEnv,
    RiffOne,
    RiffOneN,
} from '../assetLoader/AssetLoader.js';


export default class World1 {
    constructor(scene) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
    };
    
    initPools() {
        this.groundPool = [];
        this.wolkenPool = [];
        this.seaWeedPool = [];
        this.waveFrontPool = [];
        this.waveBackPool = [];
        this.bubbleEnvPool = [];
        this.RiffPool = []; 
        this.riffColliderPool = [];
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEYS.KEY_HIMEL)) scene.load.image(KEYS.KEY_HIMEL, Himmel);
        if (!scene.textures.exists(KEYS.KEY_WAVEBACK)) scene.load.image(KEYS.KEY_WAVEBACK, WaveBack);
        if (!scene.textures.exists(KEYS.KEY_WAVEFRONT)) scene.load.image(KEYS.KEY_WAVEFRONT, WaveFront);
        if (!scene.textures.exists(KEYS.KEY_WOLKEN)) scene.load.image(KEYS.KEY_WOLKEN, Wolken);
        if (!scene.textures.exists(KEYS.KEY_BODEN)) scene.load.image(KEYS.KEY_BODEN, [Boden, BodenN]);
        if (!scene.textures.exists(KEYS.KEY_SURFACESEA)) scene.load.image(KEYS.KEY_SURFACESEA, [SurfaceSea, SurfaceSeaN]);
        if (!scene.textures.exists(KEYS.KEY_MIDDLESEA)) scene.load.image(KEYS.KEY_MIDDLESEA, [MiddelSea, MiddelSeaN]);
        if (!scene.textures.exists(KEYS.KEY_DEEPSEA)) scene.load.image(KEYS.KEY_DEEPSEA, [DeepSea, DeepSeaN]);
        if (!scene.textures.exists(KEYS.KEY_EXTREAMDEEPSEA)) scene.load.image(KEYS.KEY_EXTREAMDEEPSEA, [ExtreamDeepSea, ExtreamDeepSeaN]);
        if (!scene.textures.exists(KEYS.KEY_RIFFONE)) scene.load.image(KEYS.KEY_RIFFONE, [RiffOne, RiffOneN]);
        if (!scene.textures.exists(KEYS.KEY_SEAWEED)) scene.load.spritesheet(KEYS.KEY_SEAWEED, [SeaWeed, SeaWeedN], {
            frameWidth: 42, frameHeight: 99
        });
        if (!scene.textures.exists(KEYS.KEY_BUBBLESENV)) scene.load.spritesheet(KEYS.KEY_BUBBLESENV, BubblesEnv, {
            frameWidth: 62, frameHeight: 75
        });
    };

    initAnimations () {
        this.scene.anims.create({
            key: KEYS.KEY_SEAWEED,
            frames: this.scene.anims.generateFrameNumbers(KEYS.KEY_SEAWEED, {
                start:0,
                end: 3
            }),
            frameRate: 5,
            repeat: -1
        })
        this.scene.anims.create({
            key: KEYS.KEY_BUBBLESENV,
            frames: this.scene.anims.generateFrameNumbers(KEYS.KEY_BUBBLESENV, {
                start: 0,
                end: 8,
            }),
            frameRate: 3,
            repeat: -1,
        });
    };

    startSeaweedAnim() {
        this.seaWeedPool.forEach((seaweed) => {
            this.scene.time.delayedCall(seaweed.delay, () => {
                seaweed.anims.play(KEYS.KEY_SEAWEED);
            });
        });
    };

    startBubbleAnim() {
        this.bubbleEnvPool.forEach((bubble) => {
            this.scene.time.delayedCall(bubble.delay, () => {
                bubble.anims.play(KEYS.KEY_BUBBLESENV);
            });
        });
    };

    genBubblesAndAnims() {
        let bubbleNumber = 30;
        for (let i = 0; i < bubbleNumber; i++) {
            let X = Phaser.Math.Between(0, 3840);
            let Y = Phaser.Math.Between(600, 3240);
            let bubble = this.scene.add.sprite(X, Y, KEYS.KEY_BUBBLESENV).setDepth(1);
            bubble.delay = Phaser.Math.Between(100, 3000)
            this.bubbleEnvPool.push(bubble);
        };
    };

    addColliderCircle() {
        World1Config.colliderPositionsRiffCircles.forEach(({x, y, width, height}) => {
            let collider = this.scene.physics.add.sprite(x, y, null).setVisible(false)
            collider.body.width = width;
            collider.body.height = height;
            collider.body.setImmovable(true);
            this.riffColliderPool.push(collider)
        });
    };

    create() {
        this.initPools();
        this.initAnimations();
        World1Config.backgroundPositions.forEach(({x, y, key, alpha, depth}) => {
            let image = this.scene.add.sprite(x, y, key).setPipeline("Light2D").setAlpha(alpha).setDepth(depth);
        });
        World1Config.groundPositions.forEach(({x, y, key}) => {
            let ground = this.scene.physics.add.sprite(x, y, key).setPipeline("Light2D");
            ground.body.setImmovable();
            ground.setOffset(ground.body.offset.x, 64)
            this.groundPool.push(ground);
        });
        World1Config.wolkenPosition.forEach(({x, y, key, depth}) => {
            let wolken = this.scene.add.sprite(x, y, key).setDepth(depth);
            this.wolkenPool.push(wolken);
        });
        World1Config.waveFrontPositions.forEach(({x, y, key, depth, scale}) => {
            let waveFront = this.scene.add.sprite(x, y, key).setDepth(depth).setScale(scale);
            this.waveFrontPool.push(waveFront);
        });
        World1Config.waveBackPositions.forEach(({x, y, key, depth, scale}) => {
            let waveBack = this.scene.add.sprite(x, y, key).setDepth(depth).setScale(scale);
            this.waveBackPool.push(waveBack);
        });
        World1Config.seaWeedPosition.forEach(({x, y, key, depth, scale, delay}) => {
            let seaweed = this.scene.add.sprite(x, y, key).setPipeline("Light2D").setDepth(depth).setScale(scale);
            seaweed.delay = delay;
            this.seaWeedPool.push(seaweed);
        });
        World1Config.riff1Positions.forEach(({x, y, key, depth, scale}) => {
            let riffone = this.scene.add.sprite(x, y, key).setPipeline("Light2D").setDepth(depth).setScale(scale);
            this.RiffPool.push(riffone);
        });


        this.startSeaweedAnim();
        this.genBubblesAndAnims();
        this.startBubbleAnim();
        this.addColliderCircle();
    };

    update(time, delta) {
        this.wolkenPool.forEach(wolken => {
            wolken.x -= .25;
            if (wolken.x < -960) {
                wolken.x = calcBackPositionX(1920 * 2);
            };
        });
        this.waveFrontPool.forEach(wave => {
            wave.x += .25;
            if (wave.x > calcBackPositionX(1920 * 2)) {
                wave.x = calcBackPositionX(-1920);
            };
        });
        this.waveBackPool.forEach(wave => {
            wave.x -= .25;
            if (wave.x < -940) {
                wave.x = calcBackPositionX(1920 * 2);
            };
        });
    };
};