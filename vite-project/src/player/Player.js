import Phaser from "phaser";
import BaseShip from "../BaseShip/BaseShip";
import {
    EngineBubbles,
    EngineBubblesN,
    PlayerUboot,
    PlayerUbootN,
    SurfaceAudio,
    UnderwaterAudio,
    ChestDeliverdBell,
    UbootEngineSound,
} from "../assetLoader/AssetLoader";
import PlayerGreifer from "./PlayerGreifer";

const KEY_UBOOT = "PlayerUboot";
const KEY_ANIM_UBOOT_MOVE = "PlayerUbootMove";
const KEY_ANIM_UBOOT_IDLE = "PlayerUbootIdle";
const KEY_ENGINEBUBBLES = "EngineBubbles";

const KEY_SURFACE_AUDIO = "surfaceAudio";
const KEY_UNDERWATER_AUDIO = "underwaterAudio";
const KEY_DELIVER_BELL = "DeliverBell";
const KEY_UBOOT_ENGINE_SOUND = "UbootEngineSound";

export default class Player {
    constructor(scene, baseShip) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        /**@type {BaseShip} */
        this.direction = "RIGHT";
        this.lightsActive = false;
        this.buttonQisPressed = false;
        this.isSuface = false;
    };
    //-------------------------{{{{ PRELOAD FUNCTION }}}}----------------------------
    static loadSprites(scene) {
        if (!scene.textures.exists(KEY_UBOOT)) scene.load.spritesheet(KEY_UBOOT, [PlayerUboot, PlayerUbootN], {
            frameWidth: 125, frameHeight: 93
        });
        if (!scene.textures.exists(KEY_ENGINEBUBBLES)) scene.load.spritesheet(KEY_ENGINEBUBBLES, [EngineBubbles, EngineBubblesN], {
            frameWidth: 18, frameHeight: 21
        });
        scene.load.audio(KEY_SURFACE_AUDIO, SurfaceAudio);
        scene.load.audio(KEY_UNDERWATER_AUDIO, UnderwaterAudio);
        scene.load.audio(KEY_DELIVER_BELL, ChestDeliverdBell);
        scene.load.audio(KEY_UBOOT_ENGINE_SOUND, UbootEngineSound);
        PlayerGreifer.loadSprites(scene);
    };
    //--------------------------{{{{ ANIMATION LOADER}}}}----------------------------
    static initAnimations(scene) {
        if (!scene.anims.exists(KEY_ANIM_UBOOT_IDLE)) {
            scene.anims.create({
                key: KEY_ANIM_UBOOT_IDLE,
                frames: scene.anims.generateFrameNumbers(KEY_UBOOT, {
                    start: 0,
                    end: 0
                }),
                frameRate: 0,
                repeat: -1
            });
        };

        if (!scene.anims.exists(KEY_ANIM_UBOOT_MOVE)) {
            scene.anims.create({
                key: KEY_ANIM_UBOOT_MOVE,
                frames: scene.anims.generateFrameNumbers(KEY_UBOOT, {
                    start: 0,
                    end: 6
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!scene.anims.exists(KEY_ENGINEBUBBLES)) {
            scene.anims.create({
                key: KEY_ENGINEBUBBLES,
                frames: scene.anims.generateFrameNumbers(KEY_ENGINEBUBBLES, {
                    start: 0,
                    end: 5
                }),
                frameRate: 5,
                repeat: -1,
            });
        };
    };
    //----------------------------{{{{ CREATE SECTION}}}}--------------------------------
    create(x, y) {
        this.uboot = this.scene.physics.add.sprite(x, y, KEY_UBOOT).setScale(2).setPipeline("Light2D").setDepth(1);
        this.uboot.setCollideWorldBounds(true);
        this.uboot.setBodySize(this.uboot.body.width, 63);
        this.uboot.body.offset.y = 30;
        this.ubootLight = this.scene.lights.addLight(this.uboot.x + 100, this.uboot.y + 40, 500).setIntensity(1);
        this.ubootLight.setVisible(false);

        this.engineBubbles = this.scene.add.sprite(this.uboot.x, this.uboot.y, KEY_ENGINEBUBBLES).setScale(2);

        this.ubootGreifer = new PlayerGreifer(this.scene, this);
        this.ubootGreifer.create();

        this.scene.cameras.main.startFollow(this.uboot);
        this.initKeybord();

        this.surfaceAmbiente = this.scene.sound.add(KEY_SURFACE_AUDIO, {loop: true});
        this.underwaterAmbiente = this.scene.sound.add(KEY_UNDERWATER_AUDIO, {loop: true}).setVolume(0.01);
        this.deliverBell = this.scene.sound.add(KEY_DELIVER_BELL);
        this.ubootEngine = this.scene.sound.add(KEY_UBOOT_ENGINE_SOUND).setVolume(0.01);
    };

    initKeybord() {
        this.cursors = this.scene.input.keyboard.createCursorKeys(); //Uboot Controls
        this.ButtonE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); //Action Button
        this.ButtonQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); //Uboot Lights
        this.ButtonW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); //Lift Crane
        this.ButtonS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); //Lower Crane
    };

    setFollowCamera(width, height) {
        this.scene.cameras.main.setBounds(0, 0, width, height);
        this.scene.cameras.main.setDeadzone(50, 50);
        this.scene.cameras.main.startFollow(this.uboot, false, 1, 1);
    };

    //-------------------------{{{{ LIGHT Position HANDLER}}}}----------------------------
    updateLightPositionX(direction) {
        switch(direction) {
            case "RIGHT":
                this.uboot.flipX = false;
                this.engineBubbles.flipX = false;
                this.ubootLight.x = this.uboot.x + 100
                this.engineBubbles.x = this.uboot.x -150
                break;
            case "LEFT":
                this.uboot.flipX = true;
                this.engineBubbles.flipX = true;
                this.ubootLight.x = this.uboot.x - 100;
                this.engineBubbles.x = this.uboot.x + 150;
                break;
        }
    };
    updateLightPositionY() {
        this.ubootLight.y = this.uboot.y + 40;
        this.engineBubbles.y = this.uboot.y;
    }

    //-------------------------{{{{ LIGHT Position HANDLER }}}}---------------------------
    ubootLightSwitch() {
        this.lightsActive = !this.lightsActive
        this.ubootLight.setVisible(this.lightsActive)
    }

    ubootEngineSoundPlay() {
        if (!this.ubootEngine.isPlaying) {
            this.ubootEngine.play();
        };
    }

    //-------------------------{{{{ PLAYER CONTROL HANDLER }}}}---------------------------
    constrolHandler() {
         //Controls
         if (this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.direction = "LEFT";
            this.uboot.setVelocityX(-120);
            this.ubootEngineSoundPlay();
        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
            this.direction = "RIGHT";
            this.uboot.setVelocityX(120);
            this.ubootEngineSoundPlay();

        } else {
            this.uboot.setVelocityX(0);
            this.direction = "IDLE";
            this.ubootEngine.stop();
        }

        if (this.cursors.up.isDown && !this.cursors.down.isDown && !this.isSuface) {
            this.uboot.setVelocityY(-70);
        } else if (this.cursors.down.isDown && !this.cursors.up.isDown) {
            this.uboot.setVelocityY(70);
        } else {this.uboot.setVelocityY(0);}
        
        if (this.ButtonQ.isDown && !this.buttonQisPressed) {
            this.ubootLightSwitch();
            this.buttonQisPressed = true;
        } else if (this.ButtonQ.isUp) {
            this.buttonQisPressed = false;
        }
    };

    checkIsSurface() {
        if (this.uboot.y < 530) {
            this.isSuface = true;
        } else {
            this.isSuface = false;
        }
    }
    //----------------------{{{{ ANIMATION STATE CONTROL }}}}-----------------------------
    animationStates(newState) {
        if (this.currentState === newState) return;
        switch(newState) {
            case "IDLE":
                this.uboot.anims.play(KEY_ANIM_UBOOT_IDLE)
                this.engineBubbles.setVisible(false);
                break;
            case "LEFT":
                this.engineBubbles.setVisible(true);
                this.uboot.anims.play(KEY_ANIM_UBOOT_MOVE)
                this.engineBubbles.anims.play(KEY_ENGINEBUBBLES);
                break;
            case "RIGHT":
                this.engineBubbles.setVisible(true);
                this.uboot.anims.play(KEY_ANIM_UBOOT_MOVE)
                this.engineBubbles.anims.play(KEY_ENGINEBUBBLES);
                break;

        };
        this.currentState = newState;
    };

    playerSoundHandler() {
        if (this.uboot.y < 650 && !this.surfaceAmbiente.isPlaying) {
            this.surfaceAmbiente.play();
            this.underwaterAmbiente.stop();
        }
        if (this.uboot.y > 650 && !this.underwaterAmbiente.isPlaying) {
            this.surfaceAmbiente.stop();
            this.underwaterAmbiente.play();
        }
    }

    chestDeliverdSound() {
        this.deliverBell.play();
    };

    //-------------------------{{{{ GAME UPDATE LOOP }}}}---------------------------------
    update(time, delta) {
        //Light Position Handlers
        this.updateLightPositionX(this.direction);
        this.updateLightPositionY();
        //Animation Handler
        this.animationStates(this.direction);
        //Dive Handler
        this.checkIsSurface();

        //Check for Body and Obj
        if (this.uboot && this.uboot.body) {
            //Controls Updater
           this.constrolHandler();
        }
        this.ubootGreifer.update();

        this.playerSoundHandler();
    };
}