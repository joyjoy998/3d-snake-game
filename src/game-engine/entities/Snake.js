import Entity from "./Entity";
import { LinkedList, ListNode } from "../../utils/algorithm";
import { PALETTES, SNAKE_DIRECTION, GRID_SIZE } from "../../utils/constants";
import {
  EventDispatcher,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

//把 Material变为全局变量，这样改变一个节点的Material颜色，所有蛇节点都会改变
const snakeNodeGeometry = new RoundedBoxGeometry(0.9, 0.9, 0.9, 5, 0.1);
const snakeNodeMaterial = new MeshStandardMaterial({
  color: PALETTES.green.snakeColor,
});

class SnakeNode extends Entity {
  constructor(isHead = false) {
    const snakeNodeMesh = new Mesh(snakeNodeGeometry, snakeNodeMaterial);
    super(snakeNodeMesh);

    if (isHead) {
      this.createHeadFeatures();
    }
  }

  createHeadFeatures() {
    const headMesh = this.mesh;
    const leftEyeMesh = new Mesh(
      new SphereGeometry(0.2, 10, 10),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    leftEyeMesh.scale.x = 0.1;
    leftEyeMesh.position.x = 0.5;
    leftEyeMesh.position.y = 0.12;
    leftEyeMesh.position.z = -0.1;

    let leftEyeHoleMesh = new Mesh(
      new SphereGeometry(0.22, 10, 10),
      new MeshStandardMaterial({ color: 0x333333 })
    );
    leftEyeHoleMesh.scale.set(1, 0.6, 0.6);
    leftEyeHoleMesh.position.x += 0.05;
    leftEyeMesh.add(leftEyeHoleMesh);

    const rightEyeMesh = leftEyeMesh.clone();

    rightEyeMesh.position.x = -0.5;
    rightEyeMesh.rotation.y = Math.PI;

    const mouthMesh = new Mesh(
      new RoundedBoxGeometry(1.05, 0.1, 0.6, 5, 0.1),
      new MeshStandardMaterial({
        color: this.mouthColor,
      })
    );

    mouthMesh.rotation.x = -Math.PI * 0.07;
    mouthMesh.position.z = 0.23;
    mouthMesh.position.y = -0.19;

    headMesh.add(leftEyeMesh, rightEyeMesh, mouthMesh);
    headMesh.lookAt(headMesh.position.clone().add(this.direction));
    this.mouth = mouthMesh;
  }

  getPaletteColor(paletteColor) {
    return {
      snakeColor: PALETTES[paletteColor].snakeColor,
      mouthColor: PALETTES[paletteColor].mouthColor,
    };
  }

  changePalette(paletteColor) {
    if (this.currentPalette === paletteColor) return;

    const { snakeColor, mouthColor } = this.getPaletteColor(paletteColor);
    if (!snakeColor || !mouthColor) return;

    this.mesh.material.color.set(snakeColor);
    if (this.mouth) {
      this.mouth.material.color.set(mouthColor);
    }
    this.currentPalette = paletteColor;
  }
}

//
export default class Snake extends EventDispatcher {
  constructor() {
    super();
  }

  get head() {
    return this.body.head.data;
  }

  get tail() {
    return this.body.tail.data;
  }

  initSnake(scene) {
    this.snakeDirection = SNAKE_DIRECTION["up"];
    this.indexes = [];
    const headNode = new ListNode(new SnakeNode(true));
    headNode.data.mesh.position.set(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2);
    this.body = new LinkedList(headNode);
    this.indexes.push(this.head.getIndexByCoord());

    let lastPosition = this.head.mesh.position.clone();
    for (let i = 0; i < 3; i++) {
      const position = lastPosition.clone();
      position.sub(this.snakeDirection);
      this.addTailNode(scene);
      this.tail.mesh.position.copy(position);
      this.indexes.push(this.tail.getIndexByCoord());
      lastPosition = position;
    }
    scene.add(this.head.mesh);
  }

  addTailNode(scene) {
    const tailNode = new ListNode(new SnakeNode());
    tailNode.data.mesh.position.copy(this.tail.mesh.position);
    this.body.addNode(tailNode);
    scene.add(tailNode.data.mesh);
    tailNode.data.in();
  }

  updateIndexes() {
    this.indexes.length = 0;
    let node = this.body.head;
    while (node) {
      this.indexes.push(node.data.getIndexByCoord());
      node = node.next;
    }
  }

  setSnakeDirection(directionKey) {
    let newDirection;
    switch (directionKey) {
      case "ArrowUp":
      case "W":
        newDirection = SNAKE_DIRECTION["up"];
        break;
      case "ArrowDown":
      case "S":
        newDirection = SNAKE_DIRECTION["down"];
        break;
      case "ArrowLeft":
      case "A":
        newDirection = SNAKE_DIRECTION["left"];
        break;
      case "ArrowRight":
      case "D":
        newDirection = SNAKE_DIRECTION["right"];
        break;
      default:
        return;
    }
    const dot = this.snakeDirection.dot(newDirection);
    if (dot === -1 || dot === 1) return;
    if (dot === 0) {
      this.snakeDirection = newDirection;
    }
  }

  move(entitiesIndexes, foodIndex) {
    let currentNode = this.body.tail;

    // 更新蛇身位置
    while (currentNode.prev) {
      const position = currentNode.prev.data.mesh.position;
      currentNode.data.updatePosition(position);
      currentNode = currentNode.prev;
    }

    // 计算蛇头的新位置
    const headPosition = currentNode.data.mesh.position;
    const newPosition = headPosition.clone();
    newPosition.add(this.snakeDirection);

    // 处理蛇头超出边界的情况
    if (newPosition.z < 0) {
      newPosition.z = GRID_SIZE.y - 1;
    } else if (newPosition.z > GRID_SIZE.y - 1) {
      newPosition.z = 0;
    }

    if (newPosition.x < 0) {
      newPosition.x = GRID_SIZE.x - 1;
    } else if (newPosition.x > GRID_SIZE.x - 1) {
      newPosition.x = 0;
    }

    // 更新蛇头位置
    currentNode.data.updatePosition(newPosition);
    const headMesh = this.head.mesh;
    headMesh.lookAt(headMesh.position.clone().add(this.snakeDirection));

    this.updateIndexes();

    const headIndex = this.head.getIndexByCoord();

    if (headIndex === foodIndex) {
      this.dispatchEvent(new Event("foodEaten"));
    } else if (
      this.indexes.slice(1).includes(headIndex) ||
      entitiesIndexes.includes(headIndex)
    ) {
      this.dispatchEvent(new Event("gameOver"));
    }
  }

  gameOver(scene) {
    let currentNode = this.body.head;
    while (currentNode) {
      currentNode.data.out();
      scene.remove(currentNode.data.mesh);
      currentNode.data.dispose();
      currentNode = currentNode.next;
    }
    this.body.clear();
    this.indexes.length = 0;
  }
}
