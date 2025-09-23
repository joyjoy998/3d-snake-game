import { useGame } from "../hooks/useGame";

export default function GameCanvas() {
  const { canvasRef } = useGame();

  return (
    <div className="relative w-full h-full">
      <div ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
