import Snake from "../entities/Snake";
import Food from "../entities/Food";
import Rock from "../entities/Rock";
import Tree from "../entities/Tree";
import ScoreText from "../entities/ScoreText";
import Ground from "../entities/Ground";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import fontSrc from "three/examples/fonts/helvetiker_bold.typeface.json?url";
import { createScene } from "../scene/scene";
import { EventDispatcher, LoadingManager } from "three";
import { getRandomPosition, getRandomScale } from "../utils/math";
import {
  TOTAL_ROCK_COUNT,
  TOTAL_TREE_COUNT,
  IN_GRID_COUNT,
  unoccupiedIndexes,
  KEY_MAPPINGS,
  PALETTES,
} from "../utils/constants";

const { scene, renderer, camera } = createScene();

export default class GameControl extends EventDispatcher {
  constructor() {
    super();
    this.currentPalette = "green";
    this.snake = null;
    this.food = null;
    this.ground = null;

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.isGameOver = false;
    this.isRunning = null;

    this.foodIndex = null;
    this.snakeIndexes = [];
    this.inGridObstacleIndexes = [];
    this.allObstacle = [];

    this._handleFoodEaten = this._handleFoodEaten.bind(this);
    this._handleGameOver = this._handleGameOver.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  initGame() {
    this.score = 0;
    this.generateGroundAndGrid();
    this.generateRockNTree();
    this.snake = new Snake();
    this.generateScoreText();
    this.snake.initSnake(this.scene);
    this.snakeIndexes = this.snake.indexes;

    this.food = new Food();
    this.scene.add(this.food.mesh);
    this.food.generateFood(this.snakeIndexes, this.inGridObstacleIndexes);
    this.foodIndex = this.food.index;

    this.changePalette(this.currentPalette);

    this._startAnimating();

    this.snake.addEventListener("foodEaten", this._handleFoodEaten);
    this.snake.addEventListener("gameOver", this._handleGameOver);
    document.addEventListener("keydown", this._handleKeyDown);
  }

  startGame() {
    this.camera.isGameStarted = true;
    this.isGameOver = false;
    this.score = 0;

    if (!this.isGameOver && this.camera.isGameStarted) {
      this.isRunning = setInterval(() => {
        this.snake.move();
      }, 240);
    }
  }

  _startAnimating() {
    this.camera.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._startAnimating);
  }

  _handleKeyDown(event) {
    const directionKey = KEY_MAPPINGS[event.code] || KEY_MAPPINGS[event.key];
    if (directionKey) {
      this.snake.setSnakeDirection(directionKey);
    }
  }

  _handleFoodEaten() {
    this.score++;
    this.scoreText.updateScore(this.score, this.scene);
    this.food.generateFood(this.snakeIndexes, this.inGridObstacleIndexes);
  }

  _handleGameOver() {
    this.isGameOver = true;

    clearInterval(this.isRunning);
    this.snake.gameOver(this.scene);
    this.food.gameOver(this.scene);
    this.scoreText.gameOver(this.scene);
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

  changePalette(paletteColor) {
    this.currentPalette = paletteColor;
    this.scene.background.set(PALETTES[paletteColor].fogColor);
    this.scene.fog.color.set(PALETTES[paletteColor].fogColor);
    this.scoreText.changePalette(paletteColor);
    this.snake.changePalette(paletteColor);
    this.food.changePalette(paletteColor);
    this.ground.changePalette(paletteColor);
    this.allObstacle.forEach((obstacle) => {
      obstacle.changePalette(paletteColor);
    });
  }

  generateGroundAndGrid() {
    this.ground = new Ground();
    this.scene.add(...this.ground.getMesh());
  }

  generateScoreText() {
    const manager = new LoadingManager();
    const fontLoader = new FontLoader(manager);
    let font;
    manager.onLoad = () => {
      this.scoreText = new ScoreText(font);
      this.scene.add(this.scoreText.mesh);
    };
    fontLoader.load(fontSrc, (loadedFont) => {
      font = loadedFont;
    });
  }

  generateRockNTree() {
    const totalCount = TOTAL_ROCK_COUNT + TOTAL_TREE_COUNT;
    let rockCount,
      entityCount = 0;
    //先处理在网格内的阻碍物
    //网格内岩石树木数量不确定
    for (let i = 0; i < IN_GRID_COUNT; i++) {
      const isRock = Math.random() < 0.5;
      const position = getRandomPosition(unoccupiedIndexes, true, isRock);
      const scale = getRandomScale();
      if (isRock) {
        const rock = new Rock(position, scale);
        this.scene.add(rock.mesh);
        this.inGridObstacleIndexes.push(position);
        this.allObstacle.push(rock);
        rockCount++;
      } else {
        const tree = new Tree(position, scale);
        this.scene.add(tree.mesh);
        this.inGridObstacleIndexes.push(position);
        this.allObstacle.push(tree);
      }
      entityCount++;
    }

    //再处理不在网格内的阻碍物
    while (entityCount < totalCount) {
      const scale = getRandomScale();
      if (rockCount < TOTAL_ROCK_COUNT) {
        const position = getRandomPosition(unoccupiedIndexes, false, true);
        const rock = new Rock(position, scale);
        this.scene.add(rock.mesh);
        this.allObstacle.push(rock);
        rockCount++;
      } else {
        const position = getRandomPosition(unoccupiedIndexes, false, false);
        const tree = new Tree(position, scale);
        this.scene.add(tree.mesh);
        this.allObstacle.push(tree);
      }
      entityCount++;
    }
  }

  cleanUpAllTreeNRock() {
    this.allObstacle.forEach((obstacle) => {
      this.scene.remove(obstacle.mesh);
      obstacle.dispose();
    });
    this.allObstacle.length = 0;
    this.inGridObstacleIndexes.length = 0;
  }
}
