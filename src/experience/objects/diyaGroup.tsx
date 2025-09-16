import { useEffect } from "react"
import * as THREE from "three";
import { SceneManager } from "../sceneManager";

export const DiyaGroup = () => {
    useEffect(() => {
        const { scene, animationQueue } = SceneManager;
        // Create diya group
        const diyaGroup = new THREE.Group();
        diyaGroup.position.z = 2.8;
        diyaGroup.position.y = -0.5;
        diyaGroup.rotation.y = -1.5
        SceneManager.diyaGroup = diyaGroup;
        scene.add(diyaGroup);
        animationQueue.push({
            animate: () => {
                diyaGroup.children.forEach(diya => {
                    if (diya.userData.flame) {
                        const { flame, halo, flameLight, scale } = diya.userData;

                        const t = Date.now() * 0.005;
                        // Flame flicker
                        flame.scale.y = scale + Math.sin(t * 2.5) * 0.05;
                        flame.material.opacity = 0.85 + Math.sin(t * 5) * 0.1;
                        flameLight.intensity = 1.2 + Math.sin(t * 3) * 0.5;

                        // Halo pulsation
                        halo.material.opacity = 0.25 + Math.sin(t * 2) * 0.1;
                        halo.scale.set(
                            scale * (1 + Math.sin(t) * 0.05),
                            scale * (1 + Math.sin(t) * 0.05),
                            scale
                        );
                        // 🎨 Halo color cycling (gold → orange → red)
                        const colors = [new THREE.Color(0xffd700), new THREE.Color(0xff8800), new THREE.Color(0xff3300)];
                        const colorIndex = Math.floor(t) % colors.length;
                        const nextIndex = (colorIndex + 1) % colors.length;
                        halo.material.color.copy(colors[colorIndex]).lerp(colors[nextIndex], t % 1);
                    }
                });
            }
        })

    }, [])
    return <></>
}