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
                    mode: Phaser.DOM.RESIZE,
                    width: 1920,
                    height: 1080,
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
