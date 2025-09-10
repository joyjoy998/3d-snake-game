import Entity from "./Entity";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { PALETTES } from "../utils/constants";

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

export default class ScoreText extends Entity {
  constructor(font) {
    const scoreGroup = new Group();
    super(scoreGroup);

    this.font = font;
    this.digitGeometries = new Map();
    this.digitMeshes = [];

    for (let i = 0; i < 10; i++) {
      const digitGeometry = new TextGeometry(i.toString(), {
        font: this.font,
        ...TEXT_GEOMETRY_PARAMS,
      });
      digitGeometry.center();
      this.digitGeometries.set(i.toString(), digitGeometry);
    }
  }

  updateScore(score) {
    const scoreString = score.toString();

    // 1.清除之前的数字
    this.digitMeshes.forEach((mesh) => {
      this.mesh.remove(mesh);
      mesh.material.dispose(); // 仅释放材质
    });
    this.digitMeshes = [];

    // 2.创建新的数字网格
    const charWidth = 2;
    const totalWidth = charWidth * scoreString.length;
    let xOffset = -totalWidth / 2 + charWidth / 2;
    //  3.使用当前的调色板颜色创建材质
    const currentScoreColor = this.getPaletteColor(this.currentPalette);
    const digitMaterial = new MeshStandardMaterial({
      color: currentScoreColor,
    });

    for (let i = 0; i < scoreString.length; i++) {
      const digit = scoreString[i];
      const digitGeometry = this.digitGeometries.get(digit);
      if (digitGeometry) {
        // 4.使用之前储存好的几何体创建新的数字网格
        const digitMesh = new Mesh(digitGeometry, digitMaterial);
        digitMesh.position.x = xOffset;
        this.mesh.add(digitMesh);
        this.digitMeshes.push(digitMesh);

        // 设置数字的偏移量
        xOffset += charWidth;
      }
    }
    // 5.将 group 的中心点移动到最终位置
    this.mesh.position.set(this.gridSize.x / 2 - 0.5, 1.8, -4);
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

  dispose() {
    this.digitMeshes.forEach((mesh) => {
      this.mesh.remove(mesh);
      mesh.material.dispose();
    });
    this.digitMeshes = [];
    this.digitGeometries.forEach((geometry) => geometry.dispose());
    this.digitGeometries.clear();

    super.dispose();
  }
}
