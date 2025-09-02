import gsap from "gsap";
import { GRID_SIZE, DEFAULT_ANIMATION_OPTIONS } from "../utils/constants";

//实体基类，为 Food、Snake、Rock、Tree 等实体提供基础功能
export default class Entity {
  constructor(mesh) {
    this.mesh = mesh;
    this.gridSize = GRID_SIZE;
    this.animations = new Map();
    this.currentPalette = "green";

    this.options = DEFAULT_ANIMATION_OPTIONS;
    this.mesh.castShadow = true;
    this._indexCache = null;
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
    if (this._indexCache !== null) {
      return this._indexCache;
    }

    this._indexCache =
      Math.floor(this.position.z) * this.gridSize.x +
      Math.floor(this.position.x);
    return this._indexCache;
  }

  //用于更新实体的位置及其索引
  updatePosition(position) {
    this._indexCache = null;
    this.position.set(position.x, position.y, position.z);
    this.getIndexByCoord();
  }

  //用于改变实体的颜色
  changePalette(paletteName) {
    if (this.currentPalette === paletteName) return;

    const targetColor = this.getPaletteColor(paletteName);
    if (!targetColor || !this.mesh.material) return;

    this.mesh.material.color.set(targetColor);

    this.currentPalette = paletteName;
  }

  //抽象方法（Template Method Pattern）- 用于获取实体的颜色
  getPaletteColor(paletteName) {
    throw new Error(
      `getPaletteColor(${paletteName}) must be implemented in the derived class`
    );
  }

  //用于释放实体的资源
  dispose() {
    this.animations.forEach((animation) => {
      animation.kill();
      animation.delete();
    });
    this.animations.clear();

    if (this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }

    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach((material) => material.dispose());
      }
      this.mesh.material.dispose();
    }
  }

  //用于克隆实体
  clone() {
    return new Entity(this.mesh.clone());
  }

  //用于实体的进入动画
  in(customOptions = {}) {
    const options = {
      ...this.options,
      ...customOptions,
    };

    const existingAnimation = this.animations.get("in");
    if (existingAnimation) {
      existingAnimation.kill();
    }

    const animation = gsap.from(this.mesh.scale, {
      duration: options.duration,
      x: 0,
      y: 0,
      z: 0,
      ease: `${options.ease}(${options.size}, ${options.number})`,
    });

    this.animations.set("in", animation);
  }

  //用于实体的离开动画
  out(customOptions = {}) {
    const options = {
      ...this.options,
      ...customOptions,
    };

    const existingAnimation = this.animations.get("out");
    if (existingAnimation) {
      existingAnimation.kill();
    }

    const effectType = options.effect;
    let animation;

    switch (effectType) {
      case "rotateNshrink":
        animation = this._animateOutRotateNshrink();
        break;
      case "distort":
        animation = this._animateOutDistort();
        break;
      // 未来可以添加更多效果
    }

    if (animation) {
      this.animations.set("out", animation);
    }
  }

  //用于实体的离开动画（旋转并缩小）
  _animateOutRotateNshrink() {
    const tl = gsap.timeline({ onComplete: () => this.dispose() });
    tl.to(this.mesh.rotation, {
      x: Math.random() * Math.PI * 2,
      y: Math.random() * Math.PI * 2,
      z: Math.random() * Math.PI * 2,
      duration: 0.5,
      ease: "power2.in",
    }).to(
      this.mesh.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      "-=0.2"
    );
    return tl;
  }

  //用于实体的离开动画（扭曲）
  _animateOutDistort() {
    const tl = gsap.timeline({ onComplete: () => this.dispose() });
    tl.to(this.mesh.scale, {
      x: 1.5,
      y: 0.1,
      z: 1.5,
      duration: 0.2,
      ease: "power2.in",
    })
      .to(
        this.mesh.rotation,
        {
          z: Math.PI * 0.5,
          duration: 0.2,
          ease: "power1.in",
        },
        "-=0.2"
      )
      .to(this.mesh.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    return tl;
  }
}
