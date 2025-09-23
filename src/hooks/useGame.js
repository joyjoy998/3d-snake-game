import { useRef, useEffect } from "react";
import GameControl from "../game/GameControl";
import { useGameStore } from "../store/gameStore";

let gameControl = null;

export const useGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!gameControl) {
      gameControl = new GameControl();
    }

    const renderer = gameControl.renderer;

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }
    gameControl.initGame();
    gameControl.startGame();

    const unsubscribe = useGameStore.subscribe(
      (state) => {
        // 当调色板状态改变时，通知 GameControl 改变颜色
        gameControl.changePalette(state.currentPalette);
      },
      (state) => state.currentPalette // 仅监听 currentPalette
    );

    // 返回一个清理函数
    return () => {
      // 在组件卸载时取消订阅，防止内存泄漏
      unsubscribe();
    };
  }, []);

  return { canvasRef };
};
