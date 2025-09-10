import Snake from "../entities/Snake";
import Food from "../entities/Food";
import Rock from "../entities/Rock";

export default class GameControl {
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.rock = new Rock();
  }
}
