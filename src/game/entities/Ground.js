import { GridHelper, PlaneGeometry, Mesh, MeshStandardMaterial } from "three";
import { GRID_SIZE, PALETTES } from "../utils/constants";

export default class Ground {
  constructor() {
    this.groundMesh = this._createGroundMesh(PALETTES["green"].groundColor);
    this.gridHelper = this._createGridHelper();
  }

  _createGroundMesh(paletteColor) {
    const groundGeometry = new PlaneGeometry(
      GRID_SIZE.x * 50,
      GRID_SIZE.y * 50
    );
    groundGeometry.rotateX(-Math.PI / 2);

    const groundMaterial = new MeshStandardMaterial({ color: paletteColor });

    const groundMesh = new Mesh(groundGeometry, groundMaterial);

    groundMesh.position.set(GRID_SIZE.x / 2 - 0.5, -0.5, GRID_SIZE.y / 2 - 0.5);
    groundMesh.receiveShadow = true;

    return groundMesh;
  }

  _createGridHelper() {
    const gridHelper = new GridHelper(
      GRID_SIZE.x,
      GRID_SIZE.y,
      0xffffff,
      0xffffff
    );
    gridHelper.position.set(GRID_SIZE.x / 2 - 0.5, -0.4, GRID_SIZE.y / 2 - 0.5);

    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;

    return gridHelper;
  }

  getMesh() {
    return [this.groundMesh, this.gridHelper];
  }

  changePalette(paletteColor) {
    const newColor = PALETTES[paletteColor].groundColor;
    if (!newColor) return;
    if (newColor === this.groundMesh.material.color) return;
    this.groundMesh.material.color.set(newColor);
  }

  dispose() {
    if (this.groundMesh) {
      this.groundMesh.geometry.dispose();
      this.groundMesh.material.dispose();
    }
    this.groundMesh = null;
    if (this.gridHelper) {
      this.gridHelper.geometry.dispose();
      this.gridHelper.material.dispose();
    }
    this.gridHelper = null;
  }
}
