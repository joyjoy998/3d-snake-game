import Entity from "./Entity";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { GRID_SIZE, PALETTES } from "../utils/constants";

const TEXT_GEOMETRY_PARAMS = {
  size: 3,
  depth: 1,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.1,
  bevelOffset: 0,
  bevelSegments: 5,
};

export default class ScoreText {
  constructor(font, scene) {
    this.font = font;
    this.mesh = null;
    this.updateScore(0, scene);
  }

  updateScore(score, scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }

    const scoreString = score.toString();
    const scoreGeometry = new TextGeometry(scoreString, {
      font: this.font,
      ...TEXT_GEOMETRY_PARAMS,
    });
    scoreGeometry.center();
    const scoreMesh = new Mesh(
      scoreGeometry,
      new MeshStandardMaterial({ color: PALETTES.green.snakeColor })
    );
    scoreMesh.position.set(GRID_SIZE.x / 2 - 0.5, 1.8, -4);

    scoreMesh.castShadow = true;
    scene.add(scoreMesh);
    this.mesh = scoreMesh;
  }

  getPaletteColor(paletteColor) {
    const snakeColor = PALETTES[paletteColor].snakeColor;
    if (!snakeColor) {
      throw new Error(`Palette '${paletteColor}' is missing.`);
    }
    // 将分数文本的颜色与蛇的颜色绑定
    return snakeColor;
  }

  //重新 changePalette 方法，用于遍历改变数字的颜色
  changePalette(paletteColor) {
    if (this.currentPalette === paletteColor) {
      return;
    }

    const targetColor = this.getPaletteColor(paletteColor);

    // 遍历所有当前显示的数字网格，并改变它们的颜色
    this.digitMeshes.forEach((mesh) => {
      if (mesh.material) {
        mesh.material.color.set(targetColor);
      }
    });

    this.currentPalette = paletteColor;
  }

  gameOver(scene) {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
