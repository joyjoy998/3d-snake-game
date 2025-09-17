import { GRID_SIZE } from "./constants";
import { Vector3, Vector4 } from "three";

const getIndex = (x, z, indexCache = null) => {
  if (indexCache !== null) {
    return indexCache;
  }
  indexCache = Math.floor(z) * GRID_SIZE.x + Math.floor(x);
  return indexCache;
};

const setFoodIndex = (snakeIndexes, occupiedIndexes) => {
  let x, z, index;
  do {
    x = Math.floor(Math.random() * GRID_SIZE.x);
    z = Math.floor(Math.random() * GRID_SIZE.y);
    index = z * GRID_SIZE.x + x;
  } while (snakeIndexes.includes(index) || occupiedIndexes.includes(index));
  return { index, x, z };
};

const getRandomPosition = (unoccupiedIndexes, isInGrid, isRock) => {
  let x, z, index;
  if (isInGrid) {
    do {
      x = Math.floor(Math.random() * GRID_SIZE.x);
      z = Math.floor(Math.random() * GRID_SIZE.y);
      index = z * GRID_SIZE.x + x;
    } while (unoccupiedIndexes.includes(index));
  } else {
    const side = Math.floor(Math.random() * 4);
    const outsideRange = GRID_SIZE.x + 10;
    const insideRange = GRID_SIZE.x;

    switch (side) {
      case 0:
        x = Math.random() * insideRange;
        z = outsideRange + Math.random() * 10;
        break;
      case 1:
        x = Math.random() * insideRange;
        z = -(outsideRange + Math.random() * 10);
        break;
      case 2:
        x = -(outsideRange + Math.random() * 10);
        z = Math.random() * insideRange;
        break;
      case 3:
        x = outsideRange + Math.random() * 10;
        z = Math.random() * insideRange;
        break;
    }
  }
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

export { getIndex, setFoodIndex, getRandomPosition, getRandomScale };
