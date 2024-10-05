import Phaser from "phaser";
import {
    BaseShip,
    BaseShipN,
    Kran,
    KranN,
} from '../assetLoader/AssetLoader';

const KEY_BASESHIP = "BaseShip";
const KEY_KRAN = "Kran";

export default class BaseShipClass {
    constructor(scene) {
        /**@type {Phaser.Scene} */
        this.scene = scene;
        /**@type {boolean} */
        this.isActive = true;
    };

    static loadSprites(scene) {
        if (!scene.textures.exists(KEY_BASESHIP)) scene.load.image(KEY_BASESHIP, [BaseShip, BaseShipN]);
        if (!scene.textures.exists(KEY_KRAN)) scene.load.image(KEY_KRAN, [Kran, KranN]);
    };

    initAnimations() {

    };

    create(x, y) {
        let baseShipOriginX = x;
        let baseShipOroginY = y;
        this.baseShip = this.scene.add.sprite(baseShipOriginX, baseShipOroginY, KEY_BASESHIP).setDepth(0).setScale(1.5).setPipeline("Light2D");

        this.kran = this.scene.add.sprite(baseShipOriginX - 700, baseShipOroginY - 152, KEY_KRAN).setDepth(0).setScale(1.5).setPipeline("Light2D");
        this.kran.flipX = true
    };
};