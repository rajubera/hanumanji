
// tree.ts
import * as THREE from "three";
import { GLTFLoader, type GLTF } from 'three-stdlib';
// import { KHR_materials_pbrSpecularGlossiness } from 'three-stdlib/loaders/GLTFLoader';


export function createTree(): THREE.Group {
  const tree = new THREE.Group();

  // trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 12);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5;
  tree.add(trunk);

  // leaves
  const leavesGeometry = new THREE.SphereGeometry(1.5, 16, 16);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 3.5;
  tree.add(leaves);

  return tree;
}


// Tree loader
const loader = new GLTFLoader();
// Enable extension
// loader.register((parser) => new KHR_materials_pbrSpecularGlossiness(parser));

let treeGltf: GLTF | null = null;

const createTreeFromGltf = (scene: THREE.Scene, x: number, z: number, scale=1.5) =>{
    if((treeGltf) !== null) {
const tree = (treeGltf as GLTF).scene.clone();

    tree.scale.set(scale, scale, scale);
    tree.position.set(x, -2, z);
    scene.add(tree)
    }

}

export function addTree(scene: THREE.Scene, x: number, z: number, scale=1.5, q='l') {
if(treeGltf) {
   createTreeFromGltf(scene, x,  z, scale)
} else {
loader.load("/models/tree-128.glb", (gltf) => {
    treeGltf = gltf;
    createTreeFromGltf(scene, x,  z, scale)
  });
}

}