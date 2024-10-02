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
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: window.innerWidth,
                    height: window.innerHeight,
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

        const handleResize = () => {
            if (gameRef.current) {
                gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="phaser-game" />
    );
}

export default Game;
