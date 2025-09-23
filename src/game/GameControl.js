import Snake from "./entities/Snake";
import Food from "./entities/Food";
import Rock from "./entities/Rock";
import Tree from "./entities/Tree";
import ScoreText from "./entities/ScoreText";
import Ground from "./entities/Ground";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import fontSrc from "three/examples/fonts/helvetiker_bold.typeface.json?url";
import { createScene } from "./scene/createScene";
import { EventDispatcher, Vector3 } from "three";
import {
  UNOCCUPIED_AREA,
  KEY_MAPPINGS,
  PALETTES,
  GRID_SIZE,
} from "./utils/constants";
import { useGameStore } from "../store/gameStore";
import { getIndex } from "./utils/math";

const { scene, renderer, camera, outsideGridObstacle } = createScene();

export default class GameControl extends EventDispatcher {
  constructor() {
    super();
    this.snake = null;
    this.food = null;
    this.ground = null;

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.isGameOver = false;
    this.isRunning = null;

    this.insideGridObstacle = [];
    this.outsideGridObstacle = outsideGridObstacle;

    this._handleFoodEaten = this._handleFoodEaten.bind(this);
    this._handleGameOver = this._handleGameOver.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._startAnimating = this._startAnimating.bind(this);
    this._handleResize = this._handleResize.bind(this);
  }

  initGame() {
    this.currentPalette = useGameStore.getState().currentPalette;
    this.score = 0;

    this.generateGroundAndGrid();
    this.generateRockNTree();
    this.generateScoreText();

    const insideGridObstacleIndexes = this.insideGridObstacle.map((obstacle) =>
      obstacle.getIndexByCoord()
    );

    this.snake = new Snake();
    this.snake.initSnake(this.scene);

    this.food = new Food();
    this.scene.add(this.food.mesh);
    this.food.generateFood(this.snake.indexes, insideGridObstacleIndexes);

    this._startAnimating();
    this._handleResize();

    this.snake.addEventListener("foodEaten", this._handleFoodEaten);
    this.snake.addEventListener("gameOver", this._handleGameOver);
    document.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("resize", this._handleResize);
  }

  startGame() {
    const insideGridObstacleIndexes = this.insideGridObstacle.map((obstacle) =>
      obstacle.getIndexByCoord()
    );

    this.camera.isGameStarted = true;
    this.isGameOver = useGameStore.getState().isGameOver;
    this.score = 0;

    if (!this.isGameOver && this.camera.isGameStarted) {
      this.isRunning = setInterval(() => {
        this.snake.move(insideGridObstacleIndexes, this.food.index);
      }, 240);
    }
  }

  _startAnimating() {
    this.camera.controls.update();
    this.renderer.render(this.scene, this.camera.camera);
    requestAnimationFrame(this._startAnimating);
  }

  _handleKeyDown(event) {
    const directionKey = KEY_MAPPINGS[event.code] || KEY_MAPPINGS[event.key];
    if (directionKey) {
      this.snake.setSnakeDirection(directionKey);
    }
  }

  _handleFoodEaten() {
    const insideGridObstacleIndexes = this.insideGridObstacle.map((obstacle) =>
      obstacle.getIndexByCoord()
    );

    this.snake.addTailNode(this.scene);
    this.score++;
    this.scoreText.updateScore(this.score, this.scene);
    this.food.generateFood(this.snake.indexes, insideGridObstacleIndexes);
  }

  _handleGameOver() {
    useGameStore.getState().setIsGameOver(true);

    clearInterval(this.isRunning);
    this.snake.gameOver(this.scene);
    this.food.gameOver(this.scene);
    this.scoreText.gameOver();
    this.cleanUpAllTreeNRock();
    this.camera.gameOver();

    this.isRunning = null;
    this.snake = null;
    this.food = null;
    this.scoreText = null;
    this.ground = null;

    this.snake.removeEventListener("foodEaten", this._handleFoodEaten);
    this.snake.removeEventListener("gameOver", this._handleGameOver);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  _handleRestart() {
    this.initGame();
    this.startGame();
  }

  _handleResize() {
    this.camera._onResize();
  }

  changePalette(paletteColor) {
    useGameStore.getState().setCurrentPalette(paletteColor);
    this.scene.background.set(PALETTES[paletteColor].fogColor);
    this.scene.fog.color.set(PALETTES[paletteColor].fogColor);
    this.scoreText.changePalette(paletteColor);
    this.snake.changePalette(paletteColor);
    this.food.changePalette(paletteColor);
    this.ground.changePalette(paletteColor);
    this.outsideGridObstacle.forEach((obstacle) => {
      obstacle.changePalette(paletteColor);
    });
    this.insideGridObstacle.forEach((obstacle) => {
      obstacle.changePalette(paletteColor);
    });
  }

  generateGroundAndGrid() {
    this.ground = new Ground();
    const groundMesh = this.ground.groundMesh;
    const gridHelper = this.ground.gridHelper;
    this.scene.add(groundMesh);
    this.scene.add(gridHelper);
  }

  generateScoreText() {
    const fontLoader = new FontLoader();
    fontLoader.load(fontSrc, (loadedFont) => {
      // 字体加载完成后，loadedFont 已经被正确赋值
      this.scoreText = new ScoreText(loadedFont, this.scene);
    });
  }

  generateRockNTree() {
    for (let i = 0; i < 15; i++) {
      this.generateEntity();
    }

    this.insideGridObstacle.sort((a, b) => {
      const c = new Vector3(GRID_SIZE.x / 2 - 0.5, 0, GRID_SIZE.y / 2 - 0.5);

      const distanceA = a.mesh.position.clone().sub(c).length();
      const distanceB = b.mesh.position.clone().sub(c).length();
      return distanceA - distanceB;
    });

    this.insideGridObstacle.forEach((obstacle) => {
      obstacle.in();
    });
  }

  generateEntity() {
    const obstacle = Math.random() > 0.5 ? new Rock() : new Tree();
    let index = this.getFreeIndex();

    obstacle.updateIndex(index);

    this.insideGridObstacle.push(obstacle);
    this.scene.add(obstacle.mesh);
  }

  getFreeIndex() {
    let index;
    const unoccupiedIndexes = UNOCCUPIED_AREA.map((position) =>
      getIndex(position.x, position.z)
    );
    const insideGridObstacleIndexes = this.insideGridObstacle.map(
      (obstacle) => obstacle.index
    );

    do {
      index = Math.floor(Math.random() * GRID_SIZE.x * GRID_SIZE.y);
    } while (
      unoccupiedIndexes.includes(index) ||
      insideGridObstacleIndexes.includes(index)
    );
    return index;
  }

  cleanUpAllTreeNRock() {
    this.insideGridObstacle.forEach((obstacle) => {
      this.scene.remove(obstacle.mesh);
      obstacle.dispose();
    });
    this.insideGridObstacle.length = 0;
  }
}
