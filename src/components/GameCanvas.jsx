import { useGame } from "../hooks/useGame";
import PalettePanel from "./PalettePanel";
import StartButton from "./StartButton";
import GameOverPopup from "./GameOverPopup";
import { useGameStore } from "../store/gameStore";

export default function GameCanvas() {
  const { canvasRef, gameControlRef } = useGame();

  const handleStart = () => {
    const gameControl = gameControlRef.current;
    if (gameControl) {
      useGameStore.setState({ isGameStarted: true });
      gameControl.startGame();
    } else {
      console.log("gameControl is not initialized");
    }
  };

  const handleRestart = () => {
    const gameControl = gameControlRef.current;
    if (gameControl) {
      gameControl.restartGame();
    }
  };

  return (
    <>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        <PalettePanel />
      </div>
      {!useGameStore((state) => state.isGameStarted) && (
        <StartButton onStart={handleStart} />
      )}

      {useGameStore((state) => state.isGameOver) && (
        <GameOverPopup
          score={gameControlRef.current.score}
          onRestart={handleRestart}
        />
      )}
      <div ref={canvasRef} className="w-full h-full" />
    </>
  );
}
