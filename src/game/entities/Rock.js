import Entity from "./Entity";
import { Mesh, IcosahedronGeometry, MeshStandardMaterial } from "three";
import { PALETTES } from "../utils/constants";

export default class Rock extends Entity {
  constructor() {
    const rockGeometry = new IcosahedronGeometry(0.5);
    const rockMaterial = new MeshStandardMaterial({
      flatShading: true,
      color: 0xebebeb,
    });
    const rockMesh = new Mesh(rockGeometry, rockMaterial);
    rockMesh.scale.set(
      Math.random() * 0.5 + 0.5,
      0.5 + Math.random() ** 2 * 1.9,
      1
    );
    rockMesh.rotation.y = Math.random() * Math.PI * 2;
    rockMesh.rotation.x = Math.random() * Math.PI * 0.5;
    rockMesh.rotation.order = "YXZ";
    rockMesh.position.y = -0.5;
    super(rockMesh);
  }

  // 获取岩石的颜色
  getPaletteColor(paletteColor) {
    const rockColor = PALETTES[paletteColor].rockColor;
    if (!rockColor) {
      throw new Error(`Palette color not found for ${paletteColor}`);
    }
    return rockColor;
  }
}
