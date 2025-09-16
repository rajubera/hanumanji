import { useEffect } from "react"
import * as THREE from "three";
import { SceneManager } from "../sceneManager";

export const Lights = () => {
    useEffect(() => {
        const { scene } = SceneManager;
        //light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 10);
        scene.add(light);


        // Soft global fill
        const hemiLight = new THREE.HemisphereLight(0x88cc88, 0x444444, 1);
        scene.add(hemiLight);
//         const saffronLight = new THREE.PointLight(0xff9933, 1, 10);
// saffronLight.position.set(0, 0.2, 80); // just under Hanuman
// scene.add(saffronLight);

        // Ambient backup
        scene.add(new THREE.AmbientLight(0x404040, 0.6));
    }, [])
    return <></>
}