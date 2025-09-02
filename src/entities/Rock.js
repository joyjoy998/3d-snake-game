import Entity from "./Entity";
import { Mesh, IcosahedronGeometry, MeshStandardMaterial } from "three";
import { PALETTES } from "../utils/constants";

export default class Rock extends Entity {
  constructor() {
    const ROCK_GEOMETRY = new IcosahedronGeometry(0.5);
    const ROCK_MATERIAL = new MeshStandardMaterial({
      flatShading: true,
      color: 0xebebeb,
    });
    const mesh = new Mesh(ROCK_GEOMETRY, ROCK_MATERIAL);
    mesh.scale.set(
      Math.random() * 0.5 + 0.5,
      0.5 + Math.random() ** 2 * 1.9,
      1
    );
    mesh.rotation.set(
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 2,
      0,
      "YXZ"
    );
    mesh.position.y = -0.5;
    super(mesh);
  }

  getPaletteColor(paletteColor) {
    const rockColor = PALETTES[paletteColor].rockColor;
    if (!rockColor) {
      throw new Error(`Palette color not found for ${paletteColor}`);
    }
    return rockColor;
  }
}
