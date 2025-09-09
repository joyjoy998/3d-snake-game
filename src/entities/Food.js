import gsap from "gsap";
import Entity from "./Entity";
import { SphereGeometry, MeshPhongMaterial, Mesh } from "three";
import { PALETTES } from "../utils/constants";

export default class Food extends Entity {
  constructor() {
    const foodGeometry = new SphereGeometry(0.4, 32, 32);
    const foodMaterial = new MeshPhongMaterial({
      color: PALETTES.green.foodColor,
      shininess: 100,
      emissive: 0x666600,
      emissiveIntensity: 0.5,
    });
    const foodMesh = new Mesh(foodGeometry, foodMaterial);
    super(foodMesh);
    this.scale.set(0.2, 0.2, 0.2);
  }
  // 脉冲效果-持续性放大缩小
  pluseAnimation() {
    const pulseAnimation = gsap.to(this.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 0.8,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      paused: true,
    });

    this.animations.set("pulse", pulseAnimation);
  }

  // 旋转动画
  rotateAnimation() {
    const rotateAnimation = gsap.to(this.mesh.rotation, {
      y: Math.PI * 2,
      duration: 4,
      ease: "none",
      repeat: -1,
      paused: true,
    });

    this.animations.set("rotate", rotateAnimation);
  }

  // 进入动画
  in() {
    this.pluseAnimation();
    this.rotateAnimation();

    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        this.animations.get("pulse")?.play();
        this.animations.get("rotate")?.play();
      },
    });
  }

  // 离开动画,并且会清除对应动画的引用
  out() {
    this.animations.get("pulse")?.pause();
    this.animations.get("rotate")?.pause();

    gsap.to(this.scale, {
      x: 0,
      y: 0,
      z: 0,
      onComplete: () => {
        this.animations.get("pulse")?.kill();
        this.animations.get("rotate")?.kill();
        this.animations.delete("pulse");
        this.animations.delete("rotate");
      },
    });
  }

  getPaletteColor(paletteColor) {
    const foodColor = PALETTES[paletteColor].foodColor;
    if (!foodColor) {
      throw new Error(`Palette color not found for ${paletteColor}`);
    }
    return foodColor;
  }
}
