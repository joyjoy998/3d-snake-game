import Snake from "../entities/Snake";
import Food from "../entities/Food";
import Rock from "../entities/Rock";
import { EventDispatcher } from "three";

export default class GameControl extends EventDispatcher {
  constructor() {
    super();
    this.snake = new Snake();
    this.food = new Food();
    this.rock = new Rock();
  }
}
