import gsap from "gsap";
import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GRID_SIZE } from "../utils/constants";

const FOV = 60;
const NEAR = 0.1;

export default class Camera {
  constructor(renderer) {
    this.renderer = renderer;

    this.initialPosition = new Vector3(
      GRID_SIZE.x / 2 + 5,
      4,
      GRID_SIZE.y / 2 + 4
    );

    this.finalPosition = new Vector3(
      -8 + GRID_SIZE.x / 2,
      GRID_SIZE.x / 2 + 4,
      GRID_SIZE.y + 6
    );

    this.finalTarget = new Vector3(GRID_SIZE.x / 2 - 2, 0, GRID_SIZE.y / 2 + 2);

    this.camera = this._createCamera();
    this.controls = this._createControls();

    this._bindEvents();
    this.isGameStarted = false;
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

    controls.minPolarAngle = Math.PI * 0.33;
    controls.maxPolarAngle = Math.PI * 0.42;

    controls.rotateSpeed = 0.5;
    controls.dampingFactor = 0.05;

    controls.target.copy(this.finalTarget);

    return controls;
  }

  _bindEvents() {
    this.controls.domElement.addEventListener(
      "mousedown",
      this._onMouseDown.bind(this)
    );
    this.controls.domElement.addEventListener(
      "mouseup",
      this._onMouseUp.bind(this)
    );
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _onMouseDown() {
    if (this.isGameStarted) {
      this.controls.enableRotate = true;
      if (this.animationToFP) this.animationToFP.kill();
    }
  }

  _onMouseUp() {
    if (this.isGameStarted) {
      this.moveToFinalPosition();
    }
  }

  moveToFinalPosition() {
    this.animationToFP = gsap.timeline({
      onComplete: () => {
        this.animationToFP.kill();
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

  openingAnimation() {
    gsap.fromTo(this.camera.position, this.initialPosition, {
      ...this.finalPosition,
      duration: 1.5,
      onComplete: () => {
        this.controls.enableRotate = true;
      },
    });
  }

  gameOver() {
    this.controls.enableRotate = false;
  }

  dispose() {
    this.controls.domElement.removeEventListener(
      "mousedown",
      this._onMouseDown
    );
    this.controls.domElement.removeEventListener("mouseup", this._onMouseUp);
    this.camera.dispose();
    this.controls.dispose();
    this.camera = null;
    this.controls = null;
  }
}
