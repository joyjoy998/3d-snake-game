import { useGame } from "../hooks/useGame";
import PalettePanel from "./PalettePanel";
import StartButton from "./StartButton";
import GameOverPopup from "./GameOverPopup";
import Music from "./Music";
import Media from "./Media";
import HeadFollowMode from "./HeadFollowMode";
import SideViewButton from "./SideViewButton";
import { useGameStore } from "../store/gameStore";
import { useState, useEffect } from "react";
import { isMobile } from "../game/utils/constants";

export default function GameCanvas() {
  const { canvasRef, gameControlRef } = useGame();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isHeadFollowMode, setIsHeadFollowMode] = useState(false);

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
      <PalettePanel />

      {!isGameStarted && <StartButton onStart={handleStart} />}

      {isGameOver && (
        <GameOverPopup
          score={gameControlRef.current.score}
          onRestart={handleRestart}
        />
      )}

      <Media />

      <SideViewButton />

      {!isMobile && (
        <HeadFollowMode
          isHeadFollowMode={isHeadFollowMode}
          setIsHeadFollowMode={setIsHeadFollowMode}
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
