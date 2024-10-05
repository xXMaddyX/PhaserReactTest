import Phaser from "phaser";
import TitelScene from "./scenes/TitleScreen";
import SceneLvL1 from "./scenes/MainMap";
import { useEffect, useRef } from "react";

function Game() {
    const gameRef = useRef(null);
    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game({
                type: Phaser.WEBGL,
                pixelArt: true,
                scale: {
                    parent: "phaser-game",
                    mode: Phaser.Scale.FIT,
                    width: 1920,
                    height: 1080,
                },
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: -200,
                    }
                },
                scene: [
                    new TitelScene(this),
                    new SceneLvL1(this)
                ],
            });
        }
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="phaser-game" />
    );
}

export default Game;
