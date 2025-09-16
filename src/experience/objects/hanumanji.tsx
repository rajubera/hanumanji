import { useEffect, useMemo } from "react"
import * as THREE from "three";
import { GLTFLoader } from 'three-stdlib';
import { SceneManager } from "../sceneManager";

export const HanumanJi = () => {
    useEffect(() => {
        const { scene, animationQueue, clock } = SceneManager;
        // Hanuman placeholder (sphere)
        const loader = new GLTFLoader();
        loader.load('/models/hanuman_3.glb', gltf => {
            const hanuman = gltf.scene;
            hanuman.scale.set(1, 1, 1);  // adjust
            hanuman.position.set(0, 0.8, 2);  // in center
            SceneManager.hanuman = hanuman;
            scene.add(hanuman);
        });

        // Aura (halo) behind Hanuman's head
        const auraGroup = new THREE.Group();

        // Inner glow (bright center)
        const innerAura = new THREE.Mesh(
            new THREE.CircleGeometry(0.35, 54),
            new THREE.MeshBasicMaterial({
                // color: '#ffa500',
                color: 'rgba(255, 128, 0, 1)', // golden yellow
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide
            })
        );

        // Outer rings with golden borders
        for (let i = 1; i <= 5; i++) {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.1 * i, 0.1 * i + 0.01, 54),
                new THREE.MeshStandardMaterial({
                    color: 0xffd700,       // gold border
                    emissive: 0xffa500,    // soft orange glow
                    emissiveIntensity: 0.7,
                    metalness: 0.8,
                    roughness: 0.3,
                    side: THREE.DoubleSide
                })
            );
            auraGroup.add(ring);
        }

        // Position behind Hanuman’s head
        auraGroup.add(innerAura);

        auraGroup.position.set(0, 2, 2.5); // adjust Y to match Hanuman’s head height
        scene.add(auraGroup);

        animationQueue.push({
            animate: () => {
                const elapsed = clock.getElapsedTime();

                auraGroup.children.forEach((chld, index) => {
                    const child = chld as THREE.Mesh
                    if (child.geometry.type === "CircleGeometry") {
                        // Inner glow pulsing
                        const scale = 1 + Math.sin(elapsed * 2) * 0.05; // gentle pulse
                        child.scale.set(scale, scale, 1);

                        if (child.material instanceof THREE.MeshBasicMaterial) {
                            child.material.opacity = 0.7 + Math.sin(elapsed * 3) * 0.2; // shimmer
                        }
                    } else if (child.geometry.type === "RingGeometry") {
                        // Slow rotation of rings
                        child.rotation.z = elapsed * (0.2 / (index + 1)); // different speeds for depth

                        if (child.material instanceof THREE.MeshStandardMaterial) {
                            // Slight emissive pulsing
                            child.material.emissiveIntensity = 0.2 + Math.sin(elapsed * 2) * 0.3;
                        }
                    }
                });
            }
        })
    }, [])
    return <></>
}