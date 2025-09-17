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
import { PALETTES, ROCK_DATA, TREE_DATA } from "../utils/constants";
import Camera from "./Camera";
import lights from "./lights";

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color(PALETTES["green"].fogColor);
  scene.fog = new Fog(PALETTES["green"].fogColor, 5, 40);

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

  // const rocksMeshes = ROCK_DATA.map(([position, { x, y, z, w }]) => {
  //   const rock = new Rock();
  //   rock.position.set(position);
  //   rock.scale.set(x, y, z);
  //   rock.rotation.set(0, w, 0);
  //   return rock.mesh;
  // });

  // const treesMeshes = TREE_DATA.map((position) => {
  //   const tree = new Tree();
  //   tree.position.set(position);
  //   return tree.mesh;
  // });

  // scene.add(...rocksMeshes, ...treesMeshes);

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

    planeArrows.position.set(8.7, 0, 21);
    planeWasd.position.set(13, 0, 21);
    scene.add(planeArrows, planeWasd);
  };

  textureLoader.load("/wasd.png", (loadedTexture) => {
    wasd = loadedTexture;
  });
  textureLoader.load("/arrows.png", (loadedTexture) => {
    arrows = loadedTexture;
  });

  return { scene, renderer, camera };
};
