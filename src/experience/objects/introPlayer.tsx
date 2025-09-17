import { useEffect } from "react"
import * as THREE from "three";
import { SceneManager } from "../sceneManager";


export const IntroPlayer = () => {
    useEffect(() => {
        const { animationQueue } = SceneManager;
        animationQueue.push({
            animate: () => {
                const { camera, clock, hanuman, isIntroComplete, introDuration, isIntroStarted } = SceneManager;
                if (hanuman) {
                    const elapsed = clock.getElapsedTime();
                    if (!isIntroComplete && isIntroStarted) {
                        // 🔹 Intro sequence (0 → introDuration sec)
                        const t = Math.min(elapsed / introDuration, 1); // normalize 0..1

                        // Start position (far away)
                        // const startPos = new THREE.Vector3(0, 25, 100);
                        const startPos = new THREE.Vector3(...SceneManager.initialIntroPosition)

                        // End position (closer to Hanuman)
                        const endPos = new THREE.Vector3(0, 1.3, 7.5);
                       

                        // Lerp between start and end
                        camera.position.lerpVectors(startPos, endPos, t);
                   
                        // Smooth zoom (FOV)
                        camera.fov = 80 - t * 20; // goes from 80 → 60
                        camera.updateProjectionMatrix();

                        // Always look at Hanuman
                        camera.lookAt(0, 0, 0);
                        if (t >= 1) {
                          SceneManager.markIntroComplete();
                        }
                    }

                }
            }
        })

    }, [])
    return <></>
}