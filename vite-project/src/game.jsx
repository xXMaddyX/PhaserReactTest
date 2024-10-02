import Phaser from "phaser";
import Scene1 from "./testScene";
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
                    width: 1280,
                    height: 720,
                },
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { y: 200 },
                    }
                },
                scene: [new Scene1(this)],
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
