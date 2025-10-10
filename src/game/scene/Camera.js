import gsap from "gsap";
import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GRID_SIZE, isMobile } from "../utils/constants";

const FOV = 60;
const NEAR = 0.1;

export default class Camera {
  constructor(renderer) {
    this.renderer = renderer;
    this.onMouseDown = this._onMouseDown.bind(this);
    this.onMouseUp = this._onMouseUp.bind(this);

    this.initialPosition = new Vector3(
      GRID_SIZE.x / 2 + 5,
      4,
      GRID_SIZE.y / 2 + 4
    );

    this.finalPosition = isMobile
      ? new Vector3(GRID_SIZE.x / 2, GRID_SIZE.x + 15, GRID_SIZE.y)
      : new Vector3(GRID_SIZE.x / 2 - 8, GRID_SIZE.x / 2 + 4, GRID_SIZE.y + 6);

    this.finalTarget = isMobile
      ? new Vector3(GRID_SIZE.x / 2, 0, GRID_SIZE.y / 2)
      : new Vector3(GRID_SIZE.x / 2 - 0.5, 0, GRID_SIZE.y / 2 - 0.5);

    this.camera = this._createCamera();
    this.controls = this._createControls();

    this.isHeadFollowMode = false;
  }

  _createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(FOV, aspect, NEAR);
    camera.position.copy(this.initialPosition);
    return camera;
  }

  _createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    controls.minPolarAngle = isMobile ? 0 : Math.PI * 0.33;
    controls.maxPolarAngle = Math.PI * 0.42;

    controls.rotateSpeed = 0.5;
    controls.dampingFactor = 0.05;

    controls.target.copy(this.finalTarget);

    return controls;
  }

  bindEvents() {
    this.controls.domElement.addEventListener("mousedown", this.onMouseDown);
    this.controls.domElement.addEventListener("mouseup", this.onMouseUp);
  }

  unbindEvents() {
    this.controls.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.controls.domElement.removeEventListener("mouseup", this.onMouseUp);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _onMouseDown() {
    if (!this.isHeadFollowMode) {
      this.controls.enableRotate = true;
      if (this.animationToFP) {
        this.animationToFP.kill();
        this.animationToFP = null;
      }
    }
  }

  _onMouseUp() {
    if (!this.isHeadFollowMode) {
      this.restoreBirdEyeView();
    }
  }

  followSnakeHead(snakeHeadPos, isSideViewChanged) {
    const cameraOffset = isSideViewChanged
      ? new Vector3(0, 5, -8)
      : new Vector3(0, 5, 8);
    const newCameraPos = snakeHeadPos.clone().add(cameraOffset);

    this.controls.target.lerp(snakeHeadPos, 0.01);
    this.camera.position.lerp(newCameraPos, 0.01);
  }

  switchCameraView(snakeHeadPos, isSideViewChanged) {
    const cameraOffset = isSideViewChanged
      ? new Vector3(0, 5, -8)
      : new Vector3(0, 5, 8);
    const newCameraPos = snakeHeadPos.clone().add(cameraOffset);
    gsap.to(this.camera.position, {
      x: newCameraPos.x,
      y: newCameraPos.y,
      z: newCameraPos.z,
      duration: 0.5,
      ease: "power2.inOut",
    });
    gsap.to(this.controls.target, {
      x: snakeHeadPos.x,
      y: snakeHeadPos.y,
      z: snakeHeadPos.z,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }

  restoreBirdEyeView() {
    this.animationToFP = gsap.timeline({
      onComplete: () => {
        this.animationToFP = null;
      },
    });

    this.animationToFP
      .to(this.camera.position, {
        x: this.finalPosition.x,
        y: this.finalPosition.y,
        z: this.finalPosition.z,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(
        this.controls.target,
        {
          x: this.finalTarget.x,
          y: this.finalTarget.y,
          z: this.finalTarget.z,
          duration: 1,
          ease: "power2.inOut",
        },
        "<"
      );
  }

  dispose() {
    if (isMobile && this.controls.domElement) {
      this.unbindEvents();
    }
    this.camera.dispose();
    this.controls.dispose();
    this.camera = null;
    this.controls = null;
  }
}
