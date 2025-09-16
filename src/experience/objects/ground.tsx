import { useEffect } from "react"
import * as THREE from "three";
import { SceneManager } from "../sceneManager";

export const Ground = () => {
    useEffect(() => {
        const { scene, animationQueue, clock } = SceneManager;

        //plane
        const textureLoader = new THREE.TextureLoader();
        // Load textures (put files inside /public/textures/ground/)
        const groundColor = textureLoader.load("/textures/ground/grass-color.jpg");
        const groundNormal = textureLoader.load("/textures/ground/grass-normal.png");

        // Repeat texture so it tiles instead of stretching
        groundColor.wrapS = groundColor.wrapT = THREE.RepeatWrapping;
        groundNormal.wrapS = groundNormal.wrapT = THREE.RepeatWrapping;

        groundColor.repeat.set(20, 20);   // repeat more → smaller grass
        groundNormal.repeat.set(20, 20);

        const planeGeometry = new THREE.CircleGeometry(250);

        // const planeMaterial = new THREE.MeshStandardMaterial({ color: "rgba(11, 28, 20, 1)", side: THREE.DoubleSide, opacity: 0.5 });
        // const planeMaterial = new THREE.MeshStandardMaterial({ color: "rgba(11, 28, 20, 1)", side: THREE.DoubleSide, opacity: 0.5 });
        const planeMaterial = new THREE.MeshStandardMaterial({
            map: groundColor,
            normalMap: groundNormal,
            side: THREE.DoubleSide,
            color: new THREE.Color('rgba(123, 110, 59, 1)'), // dark green tint

        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);


        plane.rotation.x = -Math.PI / 2; // 🔑 rotate to make it horizontal
        plane.position.y = -1;           // move it below the sphere
        plane.receiveShadow = true;
        scene.add(plane);



    }, [])
    return <></>
}