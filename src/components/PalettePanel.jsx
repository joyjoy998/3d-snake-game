export default function PalettePanel() {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {["green", "orange", "lilac"].map((name) => (
        <button
          key={name}
          onClick={() => changePalette(name)}
          className="cursor-pointer"
        >
          <img
            className={`aspect-square hover:scale-110 transition-transform duration-150 ease-in-out rounded-full border-2 lg:border-4 border-white w-9 lg:w-11
      ${currentPalette === name ? "scale-110" : ""}`}
            src={`/palette-${name}.png`}
            alt={`${name} theme`}
            height="44"
          />
        </button>
      ))}
    </div>
  );
}
