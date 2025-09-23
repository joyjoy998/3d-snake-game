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
