import Phaser from "phaser";
import { 
    ExitButton,
    MainScreenImg, 
    StartButton 
} from "../assetLoader/AssetLoader";

const KEY_MAINSCREEN = "MainScreen";
const KEY_START_BUTTON = "StartButton";
const KEY_EXIT_BUTTON = "ExitButton";

const KEY_START_BUTTON_ANIM = "StartButtonAnim";
const KEY_EXIT_BUTTON_ANIM = "ExitButtonAnim";

export default class TitelScene extends Phaser.Scene {
    constructor() {
        super("TitelScene");
    };

    preload() {
        if (!this.textures.exists(KEY_MAINSCREEN)) this.load.image(KEY_MAINSCREEN, MainScreenImg);
        if (!this.textures.exists(KEY_START_BUTTON)) this.load.spritesheet(KEY_START_BUTTON, StartButton, {
            frameWidth: 71, frameHeight: 71
        });
        if (!this.textures.exists(KEY_EXIT_BUTTON)) this.load.spritesheet(KEY_EXIT_BUTTON, ExitButton, {
            frameWidth: 71, frameHeight: 71
        });
    }

    initAnimations() {
        if (!this.anims.exists(KEY_START_BUTTON_ANIM)) {
            this.anims.create({
                key: KEY_START_BUTTON_ANIM,
                frames: this.anims.generateFrameNumbers(KEY_START_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
        if (!this.anims.exists(KEY_EXIT_BUTTON_ANIM)) {
            this.anims.create({
                key: KEY_EXIT_BUTTON_ANIM,
                frames: this.anims.generateFrameNumbers(KEY_EXIT_BUTTON, {
                    start: 0,
                    end: 3
                }),
                frameRate: 5,
                repeat: -1
            });
        };
    }

    create() {
        this.initAnimations();
        let background = this.add.sprite(960, 540, KEY_MAINSCREEN).setScale(2);

        let startButton = this.add.sprite(960, 600, KEY_START_BUTTON).setScale(2).setInteractive();
        startButton.postFX.addShadow(1, 1, 0.02)
        startButton.on('pointerover', () => {
            startButton.anims.play(KEY_START_BUTTON_ANIM);
        });
        startButton.on('pointerout', () => {
            startButton.anims.stop(KEY_START_BUTTON_ANIM);
            startButton.setTexture(KEY_START_BUTTON);
        });
        startButton.on('pointerdown', () => {
            this.scene.stop("TitelScene");
            this.scene.restart("TitelScene");
            this.scene.start('SceneLvL1');
        });

        let exitButton = this.add.sprite(960, 800, KEY_EXIT_BUTTON).setScale(2).setInteractive();
        exitButton.postFX.addShadow(1, 1, 0.02)
        exitButton.on('pointerover', () => {
            exitButton.anims.play(KEY_EXIT_BUTTON_ANIM);
        });
        exitButton.on('pointerout', () => {
            exitButton.anims.stop(KEY_EXIT_BUTTON_ANIM)
            exitButton.setTexture(KEY_EXIT_BUTTON)
        });
        exitButton.on('pointerdown', () => {
            window.electron.quitApp();
        });
    }
};