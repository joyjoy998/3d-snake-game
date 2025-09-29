import Entity from "./Entity";
import {
  Group,
  Mesh,
  ConeGeometry,
  MeshLambertMaterial,
  CylinderGeometry,
} from "three";
import { PALETTES } from "../utils/constants";

export default class Tree extends Entity {
  constructor(paletteColor) {
    const leavesMaterial = new MeshLambertMaterial({
      color: PALETTES[paletteColor].leavesColor,
    });
    const trunkMaterial = new MeshLambertMaterial({
      color: PALETTES[paletteColor].trunkColor,
    });
    // 用于整合树的各个部分
    const treeMesh = new Group();

    const level1Mesh = new Mesh(new ConeGeometry(0.3, 0.4, 8), leavesMaterial);
    level1Mesh.position.y = 0.7;
    treeMesh.add(level1Mesh);

    const level2Mesh = new Mesh(new ConeGeometry(0.4, 0.4, 8), leavesMaterial);
    level2Mesh.position.y = 0.5;
    treeMesh.add(level2Mesh);

    const level3Mesh = new Mesh(new ConeGeometry(0.5, 0.4, 8), leavesMaterial);
    level3Mesh.position.y = 0.3;
    treeMesh.add(level3Mesh);

    const trunkMesh = new Mesh(
      new CylinderGeometry(0.12, 0.12, 1),
      trunkMaterial
    );
    trunkMesh.position.y = 0;
    treeMesh.add(trunkMesh);

    // 设置阴影
    level1Mesh.castShadow = true;
    level2Mesh.castShadow = true;
    level3Mesh.castShadow = true;
    trunkMesh.castShadow = true;

    super(treeMesh);

    this.trunk = trunkMesh;
    this.leaves = [level1Mesh, level2Mesh, level3Mesh];
  }

  // 获取树各个部位的颜色
  getPaletteColor(paletteColor) {
    const trunkColor = PALETTES[paletteColor].trunkColor;
    const leavesColor = PALETTES[paletteColor].leavesColor;

    if (!trunkColor || !leavesColor) {
      throw new Error(
        `Palette ${paletteColor} does not have a trunkColor or leavesColor`
      );
    }

    return { trunkColor, leavesColor };
  }

  // 改变树的颜色
  changePalette(paletteColor) {
    if (this.currentPalette === paletteColor) return;

    const { trunkColor, leavesColor } = this.getPaletteColor(paletteColor);
    if (trunkColor) {
      this.trunk.material.color.set(trunkColor);
    }

    if (leavesColor) {
      this.leaves.map((leaf) => leaf.material.color.set(leavesColor));
    }

    this.currentPalette = paletteColor;
  }
}
