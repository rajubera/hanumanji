// monkey.ts
import * as THREE from "three";

export function createMonkey(color = 0x8b4513) {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16); // head
  const material = new THREE.MeshStandardMaterial({ color });
  const monkey = new THREE.Mesh(geometry, material);

  monkey.position.set(
    (Math.random() - 0.5) * 10,
    0.3,
    (Math.random() - 0.5) * 10
  );

  return monkey;
}