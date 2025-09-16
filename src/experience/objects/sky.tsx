import { useEffect } from "react"
import * as THREE from "three";
import { SceneManager } from "../sceneManager";

export const Sky = () => {
      function createSky() {
        const skyGeometry = new THREE.SphereGeometry(251, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
          side: THREE.BackSide,
          uniforms: {
            topColor: { value: new THREE.Color('#1a2a44') },   // deep navy
            bottomColor: { value: new THREE.Color('rgba(42, 28, 124, 1)') }, // horizon black
          },
          vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
          fragmentShader: `
          varying vec3 vWorldPosition;
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          void main() {
            float h = normalize(vWorldPosition).y * 0.5 + 0.5; // map -1..1 to 0..1
            gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
          }
        `,
        });
    
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        return sky
      }
      function createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
    
        for (let i = 0; i < starCount; i++) {
          const radius = 250; // distance from center
          const theta = Math.random() * Math.PI * 2; // horizontal angle
          const phi = Math.random() * Math.PI * 0.5; // 🔑 vertical angle (0 = horizon, 0.5π = zenith)
    
          positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi); // x
          positions[i * 3 + 1] = radius * Math.cos(phi);               // y
          positions[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi); // z
        }
    
        starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.8,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.9,
        });
    
        const stars = new THREE.Points(starGeometry, starMaterial);
        return stars;
      }
    useEffect(() => {
        const { scene, animationQueue, clock } = SceneManager;
        
        scene.add(createSky());
        scene.add(createStars());
        



    }, [])
    return <></>
}