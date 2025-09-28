import { GRID_SIZE } from "./constants";

const getIndex = (x, z) => {
  const index = Math.floor(z) * GRID_SIZE.x + Math.floor(x);
  return index;
};

export { getIndex };
