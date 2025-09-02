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
  constructor() {
    const leavesMaterial = new MeshLambertMaterial({ color: 0x639541 });
    const trunkMaterial = new MeshLambertMaterial({ color: 0xbb6600 });
    const levelGroup = new Group();

    const level1 = new Mesh(new ConeGeometry(0.3, 0.4, 8), leavesMaterial);
    level1.position.y = 1;
    levelGroup.add(level1);

    const level2 = new Mesh(new ConeGeometry(0.4, 0.4, 8), leavesMaterial);
    level2.position.y = 0.8;
    levelGroup.add(level2);

    const level3 = new Mesh(new ConeGeometry(0.5, 0.4, 8), leavesMaterial);
    level3.position.y = 0.6;
    levelGroup.add(level3);

    const trunk = new Mesh(
      new CylinderGeometry(0.12, 0.12, 1.2),
      trunkMaterial
    );
    trunk.position.y = 0;
    levelGroup.add(trunk);
    level1.castShadow = true;
    level2.castShadow = true;
    level3.castShadow = true;
    trunk.castShadow = true;

    const scale = Math.random() * 0.4 + 0.8;
    levelGroup.scale.set(scale, scale * (0.9 + Math.random() * 0.3), scale);
    levelGroup.rotation.y = Math.random() * Math.PI * 2;
    levelGroup.position.y = -0.5;

    super(levelGroup);

    this.trunk = trunk;
    this.leaves = [level1, level2, level3];
  }

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
