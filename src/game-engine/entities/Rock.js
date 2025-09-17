import Entity from "./Entity";
import { Mesh, IcosahedronGeometry, MeshStandardMaterial } from "three";
import { PALETTES } from "../utils/constants";

export default class Rock extends Entity {
  constructor(position, scale) {
    const rockGeometry = new IcosahedronGeometry(0.5);
    const rockMaterial = new MeshStandardMaterial({
      flatShading: true,
      color: 0xebebeb,
    });
    const rockMesh = new Mesh(rockGeometry, rockMaterial);
    rockMesh.position.copy(position);
    rockMesh.scale.set(scale.x, scale.y, scale.z);
    rockMesh.rotation.y = scale.w;
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
