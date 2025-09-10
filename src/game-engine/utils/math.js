import { gridSize } from "../constants";
const setFoodIndex = (snakeIndexes, occupiedIndexes) => {
  let x, z, index;
  do {
    x = Math.floor(Math.random() * gridSize.x);
    z = Math.floor(Math.random() * gridSize.y);
    index = z * gridSize.x + x;
  } while (snakeIndexes.includes(index) || occupiedIndexes.includes(index));
  return { index, x, z };
};

export { setFoodIndex };
