import { useGame } from "../hooks/useGame";
import PalettePanel from "./PalettePanel";
import StartButton from "./StartButton";
import GameOverPopup from "./GameOverPopup";
import Music from "./Music";
import { useGameStore } from "../store/gameStore";
import { useState, useEffect } from "react";

export default function GameCanvas() {
  const { canvasRef, gameControlRef } = useGame();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const isGameOver = useGameStore((state) => state.isGameOver);
  const isGameStarted = useGameStore((state) => state.isGameStarted);

  useEffect(() => {
    if (isGameOver) {
      setIsMusicPlaying(false);
    }
  }, [isGameOver]);

  const handleStart = () => {
    const gameControl = gameControlRef.current;
    if (gameControl) {
      setIsMusicPlaying(true);
      useGameStore.setState({ isGameStarted: true });
      gameControl.startGame();
    } else {
      console.log("gameControl is not initialized and unable to start game");
    }
  };

  const handleRestart = () => {
    const gameControl = gameControlRef.current;
    if (gameControl) {
      gameControl.restartGame();
      setIsMusicPlaying(true);
    } else {
      console.log("gameControl is not initialized and unable to restart game");
    }
  };

  return (
    <>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        <PalettePanel />
      </div>

      {!isGameStarted && <StartButton onStart={handleStart} />}

      {isGameOver && (
        <GameOverPopup
          score={gameControlRef.current.score}
          onRestart={handleRestart}
        />
      )}

      <Music
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
      />
      <div ref={canvasRef} className="w-full h-full" />
    </>
  );
}
