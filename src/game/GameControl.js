import Snake from "./entities/Snake";
import Food from "./entities/Food";
import Rock from "./entities/Rock";
import Tree from "./entities/Tree";
import ScoreText from "./entities/ScoreText";
import Ground from "./entities/Ground";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import fontSrc from "three/examples/fonts/helvetiker_bold.typeface.json?url";
import { createScene } from "./scene/createScene";
import { KEY_MAPPINGS, PALETTES, GRID_SIZE, isMobile } from "./utils/constants";
import { useGameStore } from "../store/gameStore";

const { scene, renderer, camera, outsideGridObstacle } = createScene();

export default class GameControl {
  constructor() {
    this.snake = null;
    this.food = null;
    this.ground = null;

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;

    this.audioFoodEaten = new Audio("food_eaten.mp3");
    this.audioFoodEaten.volume = 0.1;

    this.isHeadFollowMode = false;

    this.isGameOver = false;
    this.isGameStarted = false;
    this.isRunning = null;
    this.snakeSpeed = 240;

    this.insideGridObstacle = [];
    this.outsideGridObstacle = outsideGridObstacle;

    this._handleResize = this._handleResize.bind(this);
    this._startAnimating = this._startAnimating.bind(this);
  }

  initGame() {
    this.currentPalette = useGameStore.getState().currentPalette;
    this.score = 0;

    this.generateGroundAndGrid();

    this.snake = new Snake();
    this.snake.initSnake(this.scene, this.currentPalette);
    this.canChangeDirection = true;

    this.generateRockNTree();
    this.generateScoreText();

    const insideGridObstacleIndexes = this.insideGridObstacle.map(
      (obstacle) => obstacle.index
    );

    this.food = new Food(this.currentPalette);
    this.scene.add(this.food.mesh);
    this.insideGridObstacle.push(this.food);
    this.food.generateFood(this.snake.indexes, insideGridObstacleIndexes);

    this._startAnimating();
    this._handleResize();

    window.addEventListener("resize", this._handleResize.bind(this));
    this.snake.addEventListener("foodEaten", this._handleFoodEaten.bind(this));
    this.snake.addEventListener("gameOver", this._handleGameOver.bind(this));

    if (isMobile) {
      document.addEventListener(
        "touchstart",
        this._handleTouchStart.bind(this)
      );
    } else {
      document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }
  }

  startGame() {
    const insideGridObstacleIndexes = this.insideGridObstacle
      .filter((obstacle) => obstacle !== this.food)
      .map((obstacle) => obstacle.index);
    this.camera.isGameStarted = true;
    if (!this.isHeadFollowMode) this.camera.topDownOpening();
    this.score = 0;
    this.snakeSpeed = 240;

    if (!this.isGameOver && this.isGameStarted) {
      this.isRunning = setInterval(() => {
        // console.log(this.snake.head.getIndexByCoord());
        // console.log(this.snake.indexes);
        // console.log(insideGridObstacleIndexes);
        this.snake.move(insideGridObstacleIndexes, this.food.index);
        this.canChangeDirection = true;
      }, this.snakeSpeed);
    }
  }

  restartGame() {
    this._handleRestart();
    this.isGameOver = false;
    useGameStore.getState().setIsGameOver(false);
    this.initGame();
    this.startGame();
  }

  _startAnimating() {
    this.camera.controls.update();
    this.renderer.render(this.scene, this.camera.camera);
    requestAnimationFrame(this._startAnimating);
  }

  _handleTouchStart(event) {
    if (isMobile && event.touches.length > 0) {
      const touch = event.touches[0];
      // 1. 获取归一化坐标 (Normalization)
      // 将 clientX 转换为 [-1, 1] 范围
      const normalizedX = (2 * touch.clientX) / window.innerWidth - 1;
      // 将 clientY 转换为 [-1, 1] 范围 (Y轴通常是向下增长，这里转换为向上增长)
      const normalizedY = 1 - (2 * touch.clientY) / window.innerHeight;

      // 2. 判断方向：基于 |x| 和 |y| 的比较，确定扇形区域

      // 判断是水平移动为主，还是垂直移动为主
      if (Math.abs(normalizedX) > Math.abs(normalizedY)) {
        // 水平方向 (左或右)
        if (normalizedX > 0) {
          // X为正，靠近屏幕右侧
          this.snake.setSnakeDirection("ArrowRight");
          console.log("Direction: ArrowRight");
        } else {
          // X为负，靠近屏幕左侧
          this.snake.setSnakeDirection("ArrowLeft");
          console.log("Direction: ArrowLeft");
        }
      } else {
        // 垂直方向 (上或下)
        if (normalizedY > 0) {
          // Y为正，靠近屏幕上侧
          this.snake.setSnakeDirection("ArrowUp");
          console.log("Direction: ArrowUp");
        } else {
          // Y为负，靠近屏幕下侧
          this.snake.setSnakeDirection("ArrowDown");
          console.log("Direction: ArrowDown");
        }
      }
    }
  }

  _handleKeyDown(event) {
    if (event.key === "R" || event.key === "r") {
      // console.log(this.isHeadFollowMode);
      useGameStore.getState().setIsHeadFollowMode(!this.isHeadFollowMode);
      // console.log(this.isHeadFollowMode);
    }

    const directionKey = KEY_MAPPINGS[event.code] || KEY_MAPPINGS[event.key];
    if (directionKey && this.canChangeDirection) {
      this.snake.setSnakeDirection(directionKey);
      this.canChangeDirection = false;
    }
  }

  _handleFoodEaten() {
    this.audioFoodEaten.currentTime = 0;
    this.audioFoodEaten.play();

    const insideGridObstacleIndexes = this.insideGridObstacle.map(
      (obstacle) => obstacle.index
    );

    this.snake.addTailNode(this.scene, this.currentPalette);
    this.score++;
    this.scoreText.updateScore(this.score, this.scene, this.currentPalette);
    this.food.generateFood(this.snake.indexes, insideGridObstacleIndexes);

    if (this.score > 1 && (this.score & (this.score - 1)) === 0) {
      // console.log("Score is a power of 2, adding an entity.");
      this.generateEntity();
    }
    if (this.score > 0 && this.score % 3 === 0) {
      this.increaseSpeed();
    }
  }

  increaseSpeed() {
    if (this.snakeSpeed > 100) {
      this.snakeSpeed -= 20;
    }
    clearInterval(this.isRunning);
    const insideGridObstacleIndexes = this.insideGridObstacle
      .filter((obstacle) => obstacle !== this.food)
      .map((obstacle) => obstacle.index);
    this.isRunning = setInterval(() => {
      this.snake.move(insideGridObstacleIndexes, this.food.index);
      this.canChangeDirection = true;
    }, this.snakeSpeed);
  }

  _handleGameOver() {
    clearInterval(this.isRunning);

    this.snake.removeEventListener(
      "foodEaten",
      this._handleFoodEaten.bind(this)
    );
    this.snake.removeEventListener("gameOver", this._handleGameOver.bind(this));

    this.snake.gameOver(this.scene, () => {
      const finalScore = this.score;
      const highestScore = useGameStore.getState().highestScore;
      if (finalScore > highestScore) {
        useGameStore.getState().setHighestScore(finalScore);
      }
      this.isGameOver = true;
      useGameStore.getState().setIsGameOver(true);
    });

    document.removeEventListener("keydown", this._handleKeyDown.bind(this));
  }

  _handleRestart() {
    this.food.out(this.scene);
    this.scoreText.gameOver(this.scene);
    this.cleanUpAllTreeNRock();
    this.camera.gameOver();

    this.isRunning = null;
    this.snake = null;
    this.food = null;
    this.scoreText = null;
    this.ground = null;
    window.removeEventListener("resize", this._handleResize.bind(this));
  }

  _handleResize() {
    this.camera._onResize();
  }

  dispose() {}

  cleanUpAllTreeNRock() {
    this.insideGridObstacle.forEach((obstacle) => {
      this.scene.remove(obstacle.mesh);
      obstacle.dispose();
    });
    this.insideGridObstacle.length = 0;
  }

  changePalette(paletteColor) {
    if (this.currentPalette === paletteColor) return;
    this.currentPalette = paletteColor;
    this.scene.background.set(PALETTES[paletteColor].fogColor);
    this.scene.fog.color.set(PALETTES[paletteColor].fogColor);
    this.scoreText.changePalette(paletteColor);
    this.ground.changePalette(paletteColor);
    this.snake.changePalette(paletteColor);
    this.food.changePalette(paletteColor);
    this.outsideGridObstacle.forEach((obstacle) => {
      obstacle.changePalette(paletteColor);
    });
    this.insideGridObstacle.forEach((obstacle) => {
      obstacle.changePalette(paletteColor);
    });
  }

  generateGroundAndGrid() {
    this.ground = new Ground(this.currentPalette);
    const groundMesh = this.ground.groundMesh;
    const gridHelper = this.ground.gridHelper;
    this.scene.add(groundMesh);
    this.scene.add(gridHelper);
  }

  generateScoreText() {
    const fontLoader = new FontLoader();
    fontLoader.load(fontSrc, (loadedFont) => {
      // 字体加载完成后，loadedFont 已经被正确赋值
      this.scoreText = new ScoreText(
        loadedFont,
        this.scene,
        this.currentPalette
      );
    });
  }

  generateRockNTree() {
    for (let i = 0; i < 15; i++) {
      this.generateEntity();
    }

    // Sort the obstacles by their distance from the center of the grid
    /*
    this.insideGridObstacle.sort((a, b) => {
      const c = new Vector3(GRID_SIZE.x / 2 - 0.5, 0, GRID_SIZE.y / 2 - 0.5);

      const distanceA = a.mesh.position.clone().sub(c).length();
      const distanceB = b.mesh.position.clone().sub(c).length();
      return distanceA - distanceB;
    });

    this.insideGridObstacle.forEach((obstacle) => {
      obstacle.in();
    });
    */
  }

  generateEntity() {
    const obstacle =
      Math.random() > 0.5
        ? new Rock(this.currentPalette)
        : new Tree(this.currentPalette);
    let index = this.getFreeIndex();

    obstacle.updateIndex(index);

    this.insideGridObstacle.push(obstacle);
    this.scene.add(obstacle.mesh);
    obstacle.in();
  }

  getFreeIndex() {
    let index;
    const noSpawnZone = this.stayAwayFromSnake();
    const insideGridObstacleIndexes = this.insideGridObstacle.map(
      (obstacle) => obstacle.index
    );

    do {
      index = Math.floor(Math.random() * GRID_SIZE.x * GRID_SIZE.y);
    } while (
      noSpawnZone.includes(index) ||
      insideGridObstacleIndexes.includes(index)
    );
    return index;
  }

  stayAwayFromSnake() {
    const snakeIndexes = this.snake.indexes;
    const adjacentSet = new Set();

    for (const index of snakeIndexes) {
      adjacentSet.add(index);
      const adjacentIndexes = this.getAdjacentIndexes(index);
      for (const adjacentIndex of adjacentIndexes) {
        adjacentSet.add(adjacentIndex);
      }
    }

    return [...adjacentSet];
  }

  getAdjacentIndexes(index) {
    const x = index % GRID_SIZE.x;
    const z = Math.floor(index / GRID_SIZE.x);

    const direction = [
      { dx: 1, dz: 0 },
      { dx: -1, dz: 0 },
      { dx: 0, dz: 1 },
      { dx: 0, dz: -1 },
    ];

    const result = [];
    for (const { dx, dz } of direction) {
      let newX = x + dx;
      let newZ = z + dz;

      if (newZ < 0) newZ = GRID_SIZE.y - 1;
      else if (newZ >= GRID_SIZE.y) newZ = 0;

      if (newX < 0) newX = GRID_SIZE.x - 1;
      else if (newX >= GRID_SIZE.x) newX = 0;

      result.push(newZ * GRID_SIZE.x + newX);
    }
    return result;
  }
}
