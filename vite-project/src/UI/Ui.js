import Phaser from "phaser";
import Player from "../player/Player";
import { 
    ExitButton, 
    GameMenu, 
    OkButton, 
    RetryButton,
    VollTintet,
    ControllsButton,
    ControllsInfo,
    TintiSpash,
} from "../assetLoader/AssetLoader";

const KEY_MENU_BACKGROUND = "MenuBackground";
const KEY_RETRY_BUTTON = "RetryButton";
const KEY_EXIT_BUTTON = "ExitButtonGame";
const KEY_OK_BUTTON = "okButton";
const KEY_CONTROLLS_BUTTON = "ControllsButton";
const KEY_VOLLTINTET = "VollTintet";
const KEY_CONTROLLS_INFO = "ControllsInfoScreen";

const KEY_RETRY_BUTTON_ANIM = "RetryButtonAnim";
const KEY_EXIT_BUTTON_ANIM = "ExitButtonGameAnim";
const KEY_OK_BUTTON_ANIM = "okButtonAnim";
const KEY_CONTROLLS_BUTTON_ANIM = "ControllsButtonAnim";
const KEY_VOLLTINTET_ANIM = "VollTintetAnim";
const KEY_CONTROLLS_INFO_ANIM = "ControllsInfoScreenAnim";

const KEY_TINTI_SOUND = "TintiSound";

export default class Ui {
    constructor(scene, player) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        /**@type {Player} */
        this.player = player;
    };

    initUI() {
        this.menuOpen = false;
        this.actualScene = "";
        this.isVollTintet = false;
        this.chestCounter = 0;
        this.lvlEnd = false;
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEY_MENU_BACKGROUND)) scene.load.image(KEY_MENU_BACKGROUND, GameMenu);
        if (!scene.textures.exists(KEY_RETRY_BUTTON)) scene.load.spritesheet(KEY_RETRY_BUTTON, RetryButton, {
            frameWidth: 71, frameHeight: 71
        });
        if (!scene.textures.exists(KEY_EXIT_BUTTON)) scene.load.spritesheet(KEY_EXIT_BUTTON, ExitButton, {
            frameWidth: 71, frameHeight: 71
        });
        if (!scene.textures.exists(KEY_OK_BUTTON)) scene.load.spritesheet(KEY_OK_BUTTON, OkButton, {
            frameWidth: 71, frameHeight: 71
        });
        if (!scene.textures.exists(KEY_CONTROLLS_BUTTON)) scene.load.spritesheet(KEY_CONTROLLS_BUTTON, ControllsButton, {
            frameWidth: 71, frameHeight: 71
        });
        if (!scene.textures.exists(KEY_VOLLTINTET)) scene.load.spritesheet(KEY_VOLLTINTET, VollTintet, {
            frameWidth: 900, frameHeight: 506,
        });
        if (!scene.textures.exists(KEY_CONTROLLS_INFO)) scene.load.spritesheet(KEY_CONTROLLS_INFO, ControllsInfo, {
            frameWidth: 537, frameHeight: 339
        });
        scene.load.audio(KEY_TINTI_SOUND, TintiSpash);
    };

    initAnimations() {
        if (!this.scene.anims.exists(KEY_RETRY_BUTTON_ANIM)) {
            this.scene.anims.create({
                key: KEY_RETRY_BUTTON_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_RETRY_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!this.scene.anims.exists(KEY_EXIT_BUTTON_ANIM)) {
            this.scene.anims.create({
                key: KEY_EXIT_BUTTON_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_EXIT_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!this.scene.anims.exists(KEY_OK_BUTTON_ANIM)) {
            this.scene.anims.create({
                key: KEY_OK_BUTTON_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_OK_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!this.scene.anims.exists(KEY_CONTROLLS_BUTTON_ANIM)) {
            this.scene.anims.create({
                key: KEY_CONTROLLS_BUTTON_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_CONTROLLS_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!this.scene.anims.exists(KEY_VOLLTINTET_ANIM)) {
            this.scene.anims.create({
                key: KEY_VOLLTINTET_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_VOLLTINTET, {
                    start: 0,
                    end: 8
                }),
                frameRate: 3,
                repeat: 0
            });
        };
        if (!this.scene.anims.exists(KEY_CONTROLLS_INFO_ANIM)) {
            this.scene.anims.create({
                key: KEY_CONTROLLS_INFO_ANIM,
                frames: this.scene.anims.generateFrameNumbers(KEY_CONTROLLS_INFO, {
                    start: 0,
                    end: 1
                }),
                frameRate: 1,
                repeat: -1
            });
        };
    }

    getTintet() {
        this.tintAnim.setVisible(true)
        this.tintAnim.anims.play(KEY_VOLLTINTET_ANIM);
        this.isVollTintet = true;
        this.tintiSound.play();
        this.scene.time.delayedCall(2000, () => {
            this.player.uboot.x = 150;
            this.player.uboot.y = 530;

            this.scene.time.delayedCall(1000, () => {
                this.tintAnim.setVisible(false)
                this.isVollTintet = false;
            });
        });
    };

    updateDisplayOnGather() {
        this.chestCounterDisplay.setText(`Chest Counter: ${this.chestCounter} / 5`)
    }

    mainMenuOpenHandler() {
        this.menuWindow.setVisible(this.menuOpen);
        this.retryButton.setVisible(this.menuOpen);
        this.exitButton.setVisible(this.menuOpen);
        this.controllsButton.setVisible(this.menuOpen);
    }

    create() {
        this.initUI();
        this.initAnimations();
        this.escButton = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.tintAnim = this.scene.add.sprite(960, 540, KEY_VOLLTINTET).setDepth(12).setScale(3);
        this.tintAnim.setVisible(false);
        this.tintAnim.setScrollFactor(0);

        this.chestCounterDisplay = this.scene.add.text(1500, 17, `Chest Counter: ${this.chestCounter} / 5`, {
            font: '42px Georgia', fill: '#FFF', 
        })
        this.chestCounterDisplay.setScrollFactor(0);
        this.chestCounterDisplay.setDepth(10);

        this.menuWindow = this.scene.add.sprite(960, 540, KEY_MENU_BACKGROUND);
        this.menuWindow.setVisible(false);
        this.menuWindow.setScrollFactor(0);
        this.menuWindow.setDepth(10);
        this.escButton.on('down', () => {
            this.menuOpen = !this.menuOpen;
            this.mainMenuOpenHandler();
        });

        this.controllInfoScreen = this.scene.add.sprite(960, 540, KEY_CONTROLLS_INFO).setScale(2);
        this.controllInfoScreen.setVisible(false);
        this.controllInfoScreen.setScrollFactor(0);
        this.controllInfoScreen.setDepth(12);
        this.controllInfoScreen.anims.play(KEY_CONTROLLS_INFO_ANIM);

        this.retryButton = this.scene.add.sprite(850, 540, KEY_RETRY_BUTTON).setInteractive();
        this.retryButton.postFX.addShadow(1, 1, 0.02);
        this.retryButton.setDepth(11);
        this.retryButton.setVisible(false);
        this.retryButton.setScrollFactor(0);
        this.retryButton.on('pointerdown', () => {
            this.scene.resetScene();
            this.scene.scene.restart(this.actualScene);
        });
        this.retryButton.on('pointerover', () => {
            this.retryButton.anims.play(KEY_RETRY_BUTTON_ANIM);
        });
        this.retryButton.on('pointerout', () => {
            this.retryButton.anims.stop(KEY_RETRY_BUTTON_ANIM);
            this.retryButton.setTexture(KEY_RETRY_BUTTON);
        });

        this.exitButton = this.scene.add.sprite(1050, 540, KEY_EXIT_BUTTON).setInteractive();
        this.exitButton.postFX.addShadow(1, 1, 0.02);
        this.exitButton.setDepth(11);
        this.exitButton.setVisible(false);
        this.exitButton.setScrollFactor(0);
        this.exitButton.on('pointerdown', () => {
            window.electron.quitApp();
        });
        this.exitButton.on("pointerover", () => {
            this.exitButton.anims.play(KEY_EXIT_BUTTON_ANIM);
        });
        this.exitButton.on("pointerout", () => {
            this.exitButton.anims.stop(KEY_EXIT_BUTTON_ANIM);
            this.exitButton.setTexture(KEY_EXIT_BUTTON);
        });

        this.controllsButton = this.scene.add.sprite(950, 540, KEY_CONTROLLS_BUTTON).setInteractive();
        this.controllsButton.postFX.addShadow(1, 1, 0.02);
        this.controllsButton.setDepth(11);
        this.controllsButton.setVisible(false);
        this.controllsButton.setScrollFactor(0);
        this.controllsButton.on("pointerover", () => {
            this.controllsButton.anims.play(KEY_CONTROLLS_BUTTON_ANIM);
        });
        this.controllsButton.on("pointerout", () => {
            this.controllsButton.anims.stop(KEY_CONTROLLS_BUTTON_ANIM);
            this.controllsButton.setTexture(KEY_CONTROLLS_BUTTON);
        });
        this.controllsButton.on('pointerdown', () => {
            this.menuOpen = !this.menuOpen;
            this.mainMenuOpenHandler();
            this.controllInfoScreen.setVisible(true);
            this.okButton.setVisible(true)
        });

        this.okButton = this.scene.add.sprite(960, 700, KEY_OK_BUTTON).setInteractive();
        this.okButton.postFX.addShadow(1, 1, 0.02);
        this.okButton.setDepth(12);
        this.okButton.setScrollFactor(0);
        this.okButton.setVisible(false);
        this.okButton.on('pointerover', () => {
            this.okButton.anims.play(KEY_OK_BUTTON_ANIM);
        });
        this.okButton.on('pointerout', () => {
            this.okButton.anims.stop(KEY_OK_BUTTON_ANIM);
            this.okButton.setTexture(KEY_OK_BUTTON);
        });
        this.okButton.on('pointerdown', () => {
            this.controllInfoScreen.setVisible(false);
            this.okButton.setVisible(false);
        });


        this.endGameMessage = this.scene.add.text(560, 540, `You found all chests!!!! Thx for Playing our Demo 😊`, {
            font: '42px Georgia', fill: '#FFF', 
        });
        this.endGameMessage.setVisible(false)

        this.startGameMessage = this.scene.add.text(560, 550, `Find all Chest´s and bring them back to Start👌`, {
            font: '42px Georgia', fill: '#FFF', 
        });
        this.startGameMessage.setScrollFactor(0);
        this.startGameMessage.setDepth(12);
        this.startGameMessage.setVisible(false)
        this.scene.time.delayedCall(5000, () => {
            this.startGameMessage.setVisible(true);
            this.scene.time.delayedCall(5000, () => {
                this.startGameMessage.setVisible(false);
            });
        });

        this.tintiSound = this.scene.sound.add(KEY_TINTI_SOUND)
    };

    update(time, delta) {
        if (this.chestCounter === 5 && !this.lvlEnd) {
            this.lvlEnd = true;
            this.endGameMessage.setVisible(true);
        }
    };
};