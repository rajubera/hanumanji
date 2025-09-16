import { useEffect } from "react"
import { SceneManager } from "../sceneManager";
import { addTree } from "./tree";

export const Jungle = () => {
    useEffect(() => {
        const { scene, animationQueue, clock } = SceneManager;
        const treeCount = 6;
        const radius = 15;

        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 4; // little random offset
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 4;
            const scale = 1.5 + Math.random() * 0.6; // random scale for variety

            addTree(scene, x, z, scale, 'l');
        }



        const scatterCount = 6;
        const scatterRadius = 20;

        for (let i = 0; i < scatterCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * scatterRadius; // keep center a bit clear
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const scale = 1.2 + Math.random() * 1.0;

            addTree(scene, x, z, scale, 'l');
        }


    }, [])
    return <></>
}