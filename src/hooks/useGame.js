import { useRef, useEffect } from "react";
import GameControl from "../game/GameControl";
import { useGameStore } from "../store/gameStore";

export const useGame = () => {
  const canvasRef = useRef(null);
  const gameControlRef = useRef(null);

  useEffect(() => {
    if (!gameControlRef.current) {
      gameControlRef.current = new GameControl();
    }

    const gameControl = gameControlRef.current;
    const renderer = gameControl.renderer;

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }
    gameControl.initGame();

    const unsubscribe = useGameStore.subscribe(
      (state) => {
        // 当调色板状态改变时，通知 GameControl 改变颜色
        gameControl.changePalette(state.currentPalette);
      },
      (state) => state.currentPalette // 仅监听 currentPalette
    );

    const unsubscribe2 = useGameStore.subscribe(
      (state) => {
        // 当游戏开始状态改变时，通知 GameControl 改变游戏开始状态
        gameControl.isGameStarted = state.isGameStarted;
      },
      (state) => state.isGameStarted
    );

    const unsubscribe3 = useGameStore.subscribe(
      (state) => {
        // 当头跟随模式状态改变时，通知 GameControl 改变头跟随模式状态
        gameControl.isHeadFollowMode = state.isHeadFollowMode;
        gameControl.camera.isHeadFollowMode = state.isHeadFollowMode;
        if (state.isHeadFollowMode && gameControl.snake) {
          gameControl.camera.switchCameraView(
            gameControl.snake.head.mesh.position,
            gameControl.isSideViewChanged
          );
        } else {
          gameControl.camera.restoreBirdEyeView();
        }
      },
      (state) => state.isHeadFollowMode
    );

    const unsubscribe4 = useGameStore.subscribe(
      (state) => {
        // 当侧视图状态改变时，通知 GameControl 改变侧视图状态
        gameControl.isSideViewChanged = state.isSideViewChanged;
        if (gameControl.isHeadFollowMode && gameControl.snake) {
          gameControl.camera.switchCameraView(
            gameControl.snake.head.mesh.position,
            gameControl.isSideViewChanged
          );
        }
      },
      (state) => state.isSideViewChanged
    );

    // 返回一个清理函数
    return () => {
      // 在组件卸载时取消订阅，防止内存泄漏
      unsubscribe();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
      gameControl.dispose();
    };
  }, []);

  return { canvasRef, gameControlRef };
};
