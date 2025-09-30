import { useGameStore } from "../store/gameStore";

export default function PalettePanel() {
  const currentPalette = useGameStore((state) => state.currentPalette);
  const setCurrentPalette = useGameStore((state) => state.setCurrentPalette);

  const colorSrc = {
    green: "palette-green.png",
    orange: "palette-orange.png",
    purple: "palette-purple.png",
  };

  return (
    <>
      {["green", "orange", "purple"].map((color) => (
        <button
          className="p-0 m-0 border-none focus:outline-none"
          key={color}
          onClick={() => setCurrentPalette(color)}
        >
          <img
            className={`aspect-square hover:scale-125 transition-transform duration-150 ease-in-out rounded-full border-2 lg:border-4 border-white w-9 lg:w-11
      ${currentPalette === color ? "scale-110" : ""}`}
            src={colorSrc[color]}
            alt={`${color} theme`}
            height="44"
          />
        </button>
      ))}
    </>
  );
}
