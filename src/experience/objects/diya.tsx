import * as THREE from "three";  
  
  // Scale factor for small diya
  export function createDiya() {
    const scale = 0.2;

    const group = new THREE.Group();
    // Diya bowl (outer)
    const outerGeometry = new THREE.CylinderGeometry(1, 0.6, 0.4, 32, 1, false);
    const outerMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513, // earthen clay
      roughness: 0.8,
      metalness: 0.1,
    });
    const outerBowl = new THREE.Mesh(outerGeometry, outerMaterial);
    outerBowl.scale.set(scale, scale, scale);
    outerBowl.position.set(0, -0.5, 0);
    group.add(outerBowl);

    // Golden rim (slim torus on top edge)
    const rimGeometry = new THREE.TorusGeometry(1, 0.05, 16, 64);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // gold
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x331100,
    });
    const goldenRim = new THREE.Mesh(rimGeometry, rimMaterial);
    goldenRim.rotation.x = Math.PI / 2;
    goldenRim.scale.set(scale, scale, scale);
    goldenRim.position.set(0, -0.3 * scale * 5, 0); // align with top of bowl
    group.add(goldenRim);

    // Diya inner hollow
    const innerGeometry = new THREE.CylinderGeometry(0.9, 0.5, 0.35, 32, 1, false);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222, // dark inside
      roughness: 1.0,
      metalness: 0.0,
    });
    const innerBowl = new THREE.Mesh(innerGeometry, innerMaterial);
    innerBowl.scale.set(scale, scale, scale);
    innerBowl.position.set(0, -0.45, 0);
    group.add(innerBowl);
    // 🔥 Flame (slightly bigger now)
    const flameGeometry = new THREE.ConeGeometry(0.2, 0.6, 16); // bigger flame
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      transparent: true,
      opacity: 0.9,
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.scale.set(scale, scale, scale);
    flame.position.set(0, -0.15, 0); // lifted slightly above bowl
    group.add(flame);

    // 💡 Flame light
    const flameLight = new THREE.PointLight(0xffaa33, 1.5, 6);
    flameLight.position.set(0, -0.1, 0);
    group.add(flameLight);

    // 🌟 Halo glow (aura around flame)
    const haloGeometry = new THREE.RingGeometry(0.25, 0.6, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700, // golden glow
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.05, 0);
    halo.scale.set(scale, scale, scale);
    // group.add(halo);
    // Store references for animation
    group.userData = { flame, halo, flameLight, scale };
    return group;
  }