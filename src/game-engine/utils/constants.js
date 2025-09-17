import { Vector2, Vector3 } from "three";
import { getIndex } from "./math";

// Default animation options
const DEFAULT_ANIMATION_OPTIONS = {
  effect: "rotateNshrink",
  ease: "elastic.out",
  size: 1.5,
  number: 0.5,
  duration: 1,
};

// Grid size
const GRID_SIZE = new Vector2(20, 20);

const UNOCCUPIED_AREA = [
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2 - 1),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2 - 1),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2 - 1),
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2),
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2 + 1),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2 + 1),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2 + 1),
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2 + 2),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2 + 2),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2 + 2),
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2 + 3),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2 + 3),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2 + 3),
  new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2 + 4),
  new Vector3(GRID_SIZE.x / 2 + 1, 0, GRID_SIZE.y / 2 + 4),
  new Vector3(GRID_SIZE.x / 2 - 1, 0, GRID_SIZE.y / 2 + 4),
];

const unoccupiedIndexes = UNOCCUPIED_AREA.map((index) =>
  getIndex(index.x, index.z)
);

const TOTAL_ROCK_COUNT = 20;
const TOTAL_TREE_COUNT = 20;
const IN_GRID_COUNT = 15;

/*
const resX = GRID_SIZE.x;
// Rock
const ROCK_DATA = [
  [new Vector3(-7, -0.5, 2), new Vector4(2, 8, 3, 2.8)],
  [new Vector3(-3, -0.5, -10), new Vector4(3, 2, 2.5, 1.5)],
  [new Vector3(-5, -0.5, 3), new Vector4(1, 1.5, 2, 0.8)],
  [new Vector3(resX + 5, -0.5, 3), new Vector4(4, 1, 3, 1)],
  [new Vector3(resX + 4, -0.5, 2), new Vector4(2, 2, 1, 1)],
  [new Vector3(resX + 8, -0.5, 16), new Vector4(6, 2, 4, 4)],
  [new Vector3(resX + 6, -0.5, 13), new Vector4(3, 2, 2.5, 3.2)],
  [new Vector3(resX + 5, -0.5, -8), new Vector4(1, 1, 1, 0)],
  [new Vector3(resX + 6, -0.5, -7), new Vector4(2, 4, 1.5, 0.5)],
  [new Vector3(-5, -0.5, 14), new Vector4(1, 3, 2, 0)],
  [new Vector3(-4, -0.5, 15), new Vector4(0.8, 0.6, 0.7, 0)],
  [new Vector3(resX / 2 + 5, -0.5, 25), new Vector4(2.5, 0.8, 4, 2)],
  [new Vector3(resX / 2 + 9, -0.5, 22), new Vector4(1.2, 2, 1.2, 1)],
  [new Vector3(resX / 2 + 8, -0.5, 21.5), new Vector4(0.8, 1, 0.8, 2)],
];

// Tree
const TREE_DATA = [
  new Vector4(-5, 0, 10, 1),
  new Vector4(-6, 0, 15, 1.2),
  new Vector4(-5, 0, 16, 0.8),
  new Vector4(-10, 0, 4, 1.3),
  new Vector4(-5, 0, -3, 2),
  new Vector4(-4, 0, -4, 1.5),
  new Vector4(-2, 0, -15, 1),
  new Vector4(5, 0, -20, 1.2),
  new Vector4(24, 0, -12, 1.2),
  new Vector4(2, 0, -6, 1.2),
  new Vector4(3, 0, -7, 1.8),
  new Vector4(1, 0, -9, 1.0),
  new Vector4(15, 0, -8, 1.8),
  new Vector4(17, 0, -9, 1.1),
  new Vector4(18, 0, -7, 1.3),
  new Vector4(24, 0, -1, 1.3),
  new Vector4(26, 0, 0, 1.8),
  new Vector4(32, 0, 0, 1),
  new Vector4(28, 0, 6, 1.7),
  new Vector4(24, 0, 15, 1.1),
  new Vector4(16, 0, 23, 1.1),
  new Vector4(12, 0, 24, 0.9),
  new Vector4(-13, 0, -13, 0.7),
  new Vector4(35, 0, 10, 0.7),
];
*/

// Snake Direction
const SNAKE_DIRECTION = {
  up: new Vector3(0, 0, -1),
  down: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  right: new Vector3(1, 0, 0),
};

// Key mappings
const KEY_MAPPINGS = {
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",

  KeyW: "ArrowUp",
  KeyS: "ArrowDown",
  KeyA: "ArrowLeft",
  KeyD: "ArrowRight",

  w: "W",
  s: "S",
  a: "A",
  d: "D",

  W: "W",
  S: "S",
  A: "A",
  D: "D",
};

// Palettes
const PALETTES = {
  green: {
    groundColor: 0x56f854,
    fogColor: 0x39c09f,
    rockColor: 0xebebeb,
    leavesColor: 0x639541,
    trunkColor: 0x4b3621,
    foodColor: 0xffff00,
    snakeColor: 0x1d5846,
    mouthColor: 0x39c09f,
  },
  orange: {
    groundColor: 0xd68a4c,
    fogColor: 0xffac38,
    rockColor: 0xacacac,
    leavesColor: 0xa2d109,
    trunkColor: 0x3d2b1f,
    foodColor: 0x614bdd,
    snakeColor: 0xff470a,
    mouthColor: 0x614223,
  },
  lilac: {
    groundColor: 0xd199ff,
    fogColor: 0xb04ce6,
    rockColor: 0xebebeb,
    leavesColor: 0x53d0c1,
    trunkColor: 0x483c32,
    foodColor: 0x9900ff,
    snakeColor: 0xff2ed2,
    mouthColor: 0x614bdd,
  },
};

export {
  DEFAULT_ANIMATION_OPTIONS,
  GRID_SIZE,
  unoccupiedIndexes,
  KEY_MAPPINGS,
  PALETTES,
  SNAKE_DIRECTION,
  TOTAL_ROCK_COUNT,
  TOTAL_TREE_COUNT,
  IN_GRID_COUNT,
};
