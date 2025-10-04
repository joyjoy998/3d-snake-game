import {
  Scene,
  WebGLRenderer,
  Color,
  Fog,
  VSMShadowMap,
  ACESFilmicToneMapping,
  LoadingManager,
  TextureLoader,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
} from "three";
import { PALETTES, ROCK_DATA, TREE_DATA, isMobile } from "../utils/constants";
import Rock from "../entities/Rock";
import Tree from "../entities/Tree";
import Camera from "./Camera";
import lights from "./lights";

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color(PALETTES["green"].fogColor);
  scene.fog = new Fog(PALETTES["green"].fogColor, 20, 55);

  const renderer = new WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    logarithmicDepthBuffer: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap;

  const camera = new Camera(renderer);

  lights.forEach((light) => {
    scene.add(light);
  });

  const outsideGridObstacle = [];

  ROCK_DATA.forEach(([position, { x, y, z, w }]) => {
    const rock = new Rock("green");
    rock.mesh.position.copy(position);
    rock.mesh.scale.set(x, y, z);
    rock.mesh.rotation.y = w;
    outsideGridObstacle.push(rock);
    scene.add(rock.mesh);
    rock.in();
  });

  TREE_DATA.forEach(({ x, y, z, w }) => {
    const tree = new Tree("green");
    tree.mesh.position.set(x, y, z);
    tree.mesh.scale.setScalar(w);
    outsideGridObstacle.push(tree);
    scene.add(tree.mesh);
    tree.in();
  });

  const manager = new LoadingManager();
  const textureLoader = new TextureLoader(manager);
  let wasd, arrows;

  manager.onLoad = () => {
    const wasdGeometry = new PlaneGeometry(3.5, 2);
    wasdGeometry.rotateX(-Math.PI * 0.5);

    const planeWasd = new Mesh(
      wasdGeometry,
      new MeshStandardMaterial({
        transparent: true,
        map: wasd,
        opacity: 0.5,
      })
    );

    const planeArrows = new Mesh(
      wasdGeometry,
      new MeshStandardMaterial({
        transparent: true,
        map: arrows,
        opacity: 0.5,
      })
    );
    if (!isMobile) {
      planeArrows.position.set(8.7, 0, 21);
      planeWasd.position.set(13, 0, 21);
    }
    scene.add(planeArrows, planeWasd);
  };

  textureLoader.load("wasd.png", (loadedTexture) => {
    wasd = loadedTexture;
  });
  textureLoader.load("arrows.png", (loadedTexture) => {
    arrows = loadedTexture;
  });

  return { scene, renderer, camera, outsideGridObstacle };
};
