import { useEffect } from "react"
import * as THREE from "three";
import { GLTFLoader } from 'three-stdlib';
import { SceneManager } from "../sceneManager";

export const PrayingMonkey = () => {
    useEffect(() => {
        const { scene } = SceneManager;
        const loader = new GLTFLoader();
        
        loader.load('/models/prayingMonkey.glb', gltf => {
            const prayingMonkey = gltf.scene;
            prayingMonkey.scale.set(0.8, 0.8, 0.8);
            
            // Position beside Hanuman ji in sitting posture
            prayingMonkey.position.set(2.2, -1, 3.0);
            
            // Rotate to face Hanuman ji in devotional manner
            prayingMonkey.rotation.y = -Math.PI / 3;
            
            // Apply material to the unified mesh
            prayingMonkey.traverse((child) => {
                if (child instanceof THREE.Mesh && child.name === "model") {
                    // Create comprehensive realistic material
                    const monkeyMaterial = new THREE.MeshStandardMaterial({
                        color: 0x8B6F47, // Warm brown base color
                        roughness: 0.8,
                        metalness: 0.05,
                        emissive: 0x3a2617,
                        emissiveIntensity: 0.2,
                    });
                    
                    // Create detailed texture including fur and features
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024;
                    canvas.height = 1024;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx) {
                        // Base fur color
                        const furGradient = ctx.createRadialGradient(512, 512, 200, 512, 512, 512);
                        furGradient.addColorStop(0, '#A68B65'); // Lighter center (face/chest)
                        furGradient.addColorStop(0.5, '#8B6F47'); // Mid tone
                        furGradient.addColorStop(1, '#6B5437'); // Darker edges
                        ctx.fillStyle = furGradient;
                        ctx.fillRect(0, 0, 1024, 1024);
                        
                        // Add fur texture detail
                        for (let i = 0; i < 15000; i++) {
                            const x = Math.random() * 1024;
                            const y = Math.random() * 1024;
                            const gray = Math.random() * 60 + 80;
                            ctx.fillStyle = `rgba(${gray}, ${gray * 0.8}, ${gray * 0.6}, ${Math.random() * 0.5 + 0.3})`;
                            ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 3 + 2);
                        }
                        
                        // Add darker patches for depth
                        for (let i = 0; i < 50; i++) {
                            const x = Math.random() * 1024;
                            const y = Math.random() * 1024;
                            const size = Math.random() * 30 + 20;
                            ctx.fillStyle = `rgba(80, 60, 40, ${Math.random() * 0.3 + 0.1})`;
                            ctx.beginPath();
                            ctx.arc(x, y, size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        
                        const texture = new THREE.CanvasTexture(canvas);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        monkeyMaterial.map = texture;
                        
                        // Create normal map for enhanced surface detail
                        const normalCanvas = document.createElement('canvas');
                        normalCanvas.width = 512;
                        normalCanvas.height = 512;
                        const normalCtx = normalCanvas.getContext('2d');
                        
                        if (normalCtx) {
                            normalCtx.fillStyle = '#8080ff';
                            normalCtx.fillRect(0, 0, 512, 512);
                            
                            // Add surface variation
                            for (let i = 0; i < 8000; i++) {
                                const x = Math.random() * 512;
                                const y = Math.random() * 512;
                                const variance = Math.random() * 50 + 100;
                                normalCtx.fillStyle = `rgb(${variance}, ${variance}, ${200 + Math.random() * 55})`;
                                normalCtx.fillRect(x, y, 2, 2);
                            }
                            
                            const normalMap = new THREE.CanvasTexture(normalCanvas);
                            normalMap.wrapS = THREE.RepeatWrapping;
                            normalMap.wrapT = THREE.RepeatWrapping;
                            monkeyMaterial.normalMap = normalMap;
                            monkeyMaterial.normalScale = new THREE.Vector2(0.4, 0.4);
                        }
                        
                        // Create roughness map for varied surface properties
                        const roughnessCanvas = document.createElement('canvas');
                        roughnessCanvas.width = 512;
                        roughnessCanvas.height = 512;
                        const roughnessCtx = roughnessCanvas.getContext('2d');
                        
                        if (roughnessCtx) {
                            // Base roughness
                            roughnessCtx.fillStyle = '#cccccc';
                            roughnessCtx.fillRect(0, 0, 512, 512);
                            
                            // Varied roughness for different areas
                            for (let i = 0; i < 3000; i++) {
                                const x = Math.random() * 512;
                                const y = Math.random() * 512;
                                const gray = Math.random() * 100 + 150;
                                roughnessCtx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
                                roughnessCtx.fillRect(x, y, 3, 3);
                            }
                            
                            const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
                            roughnessMap.wrapS = THREE.RepeatWrapping;
                            roughnessMap.wrapT = THREE.RepeatWrapping;
                            monkeyMaterial.roughnessMap = roughnessMap;
                        }
                    }
                    
                    // Apply vertex colors if they exist (for eyes and details)
                    if (child.geometry.attributes.color) {
                        monkeyMaterial.vertexColors = true;
                        
                        // Enhance eye colors in vertex data
                        const colors = child.geometry.attributes.color;
                        const positions = child.geometry.attributes.position;
                        
                        for (let i = 0; i < colors.count; i++) {
                            const y = positions.getY(i);
                            
                            // Detect eye region by position (adjust based on your model)
                            // Typically eyes are higher up on the face
                            if (y > 0.5 && y < 0.8) {
                                // Make eye areas darker and more defined
                                const r = colors.getX(i);
                                const g = colors.getY(i);
                                const b = colors.getZ(i);
                                
                                // If it's already dark (likely eye area)
                                if (r < 0.3 && g < 0.3 && b < 0.3) {
                                    colors.setXYZ(i, 0.1, 0.05, 0.05); // Very dark brown/black
                                }
                            }
                        }
                        colors.needsUpdate = true;
                    }
                    
                    child.material = monkeyMaterial;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            scene.add(prayingMonkey);
        });
    }, [])
    
    return <></>
}