import gsap from "gsap";
import { GRID_SIZE } from "../utils/constants";

//实体基类，为 Food、Snake、Rock、Tree 等实体提供基础功能
export default class Entity {
  constructor(mesh) {
    this.mesh = mesh;
    this.gridSize = GRID_SIZE;
    this.animations = new Map();
    this.currentPalette = "green";

    this.mesh.castShadow = true;
    this.index = null;
  }

  get rotation() {
    return this.mesh.rotation;
  }

  get position() {
    return this.mesh.position;
  }

  get scale() {
    return this.mesh.scale;
  }

  //用于计算各个实体的位置索引，以便后续蛇移动后的碰撞检测
  getIndexByCoord() {
    return (
      Math.floor(this.position.z) * GRID_SIZE.x + Math.floor(this.position.x)
    );
  }

  //用于更新实体的位置及其索引
  updatePosition(position) {
    this.position.set(position.x, position.y, position.z);
    this.index = this.getIndexByCoord();
  }

  updateIndex(index) {
    this.index = index;
    this.mesh.position.x = index % GRID_SIZE.x;
    this.mesh.position.z = Math.floor(index / GRID_SIZE.x);
  }

  //用于改变实体的颜色
  changePalette(paletteColor) {
    if (this.currentPalette === paletteColor) return;

    const targetColor = this.getPaletteColor(paletteColor);
    if (!targetColor || !this.mesh.material) return;

    this.mesh.material.color.set(targetColor);

    this.currentPalette = paletteColor;
  }

  //抽象方法（Template Method Pattern）- 用于获取实体的颜色
  getPaletteColor(paletteColor) {
    throw new Error(
      `getPaletteColor(${paletteColor}) must be implemented in the derived class`
    );
  }

  //用于释放实体的资源
  dispose() {
    this.mesh.traverse((object) => {
      // 检查子对象是否是 Mesh
      if (object.isMesh) {
        // 释放几何体
        if (object.geometry) {
          object.geometry.dispose();
        }

        // 释放材质
        if (object.material) {
          // 检查材质是否是数组
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }

  //用于克隆实体
  clone() {
    return new Entity(this.mesh.clone());
  }

  //用于实体的进入动画
  in() {
    const existingAnimation = this.animations.get("in");
    if (existingAnimation) {
      existingAnimation.kill();
    }

    const animation = gsap.from(this.mesh.scale, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      ease: `elastic.out(1.5, 0.5)`,
    });

    this.animations.set("in", animation);
  }

  //用于实体的离开动画
  out(scene, callback) {
    const existingAnimation = this.animations.get("out");
    if (existingAnimation) {
      existingAnimation.kill();
    }

    const tl = gsap.timeline();

    tl.to(this.mesh.scale, {
      duration: 0.5,
      x: 1.1,
      y: 1.1,
      z: 1.1,
      ease: `power2.inOut`,
    }).to(this.mesh.scale, {
      duration: 0.5,
      x: 0,
      y: 0,
      z: 0,
      ease: `back.in`,
      onComplete: () => {
        if (this.mesh && this.mesh.parent) {
          this.mesh.parent.remove(this.mesh);
          scene.remove(this.mesh);
          this.dispose();
        }
        this.animations.delete("out");
        callback?.();
      },
    });

    this.animations.set("out", tl);
  }
}
