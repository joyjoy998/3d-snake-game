import { GRID_SIZE } from "./constants";
import { Vector3, Vector4 } from "three";

const getIndex = (x, z) => {
  const index = Math.floor(z) * GRID_SIZE.x + Math.floor(x);
  return index;
};

const getRandomPosition = (unoccupiedIndexes, isRock) => {
  let x, z, index;
  do {
    x = Math.floor(Math.random() * GRID_SIZE.x);
    z = Math.floor(Math.random() * GRID_SIZE.y);
    index = z * GRID_SIZE.x + x;
  } while (unoccupiedIndexes.includes(index));
  if (isRock) {
    return new Vector3(x, -0.5, z);
  } else {
    return new Vector3(x, 0, z);
  }
};

const getRandomScale = () => {
  const x = Math.random() * 2 + 1; // Scale x between 1 and 3
  const y = Math.random() * 2 + 0.5; // Scale y between 0.5 and 2.5
  const z = Math.random() * 2 + 1; // Scale z between 1 and 3
  const w = Math.random() * 4 + 1; // Rotation property
  return new Vector4(x, y, z, w);
};

export { getIndex, getRandomPosition, getRandomScale };
