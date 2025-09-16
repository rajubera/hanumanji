import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
function createFallingStar() {
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffddaa }); // saffron-golden
  const star = new THREE.Mesh(geometry, material);

  // Randomize starting position (very far spread)
  star.position.set(
    (Math.random() - 0.5) * 600,   // X spread, -300 → +300
    Math.random() * 400 + 100,     // Y, start much higher
    -300 - Math.random() * 500     // Z, pushed far behind scene
  );

  // Each star gets velocity
  star.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    -0.2 - Math.random() * 0.1,   // faster downward fall
    0
  );

  return star;
}

export type ISceneManager = {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    clock: THREE.Clock
    hanuman?: THREE.Group<THREE.Object3DEventMap>
    diyaGroup?: THREE.Group
    initialPosition: [number, number, number]
    introDuration: number
    isIntroStarted: boolean
    isIntroComplete: boolean
    emitter: EventTarget
    backgroundMusic: React.RefObject<HTMLAudioElement | null>
    animationQueue: Record<string, any> & { animate: () => void }[],
    init: () => void
    animate: () => void
    createGradientTexture: () => THREE.CanvasTexture
    createScene: () => void
    createCamera: () => void
    createRenderer: () => void
    createControls: () => void
    createFallingStars: () => void
    playBackgroundMusic: () => void
}
export const SceneEvents = {
    INTRO_STARTED: "intro:complete",
    INTRO_COMPLETE: "intro:complete"
}
export const SceneManager: ISceneManager = {
    scene: undefined!,      // <-- definite assignment
    camera: undefined!,
    renderer: undefined!,
    controls: undefined!,
    clock: new THREE.Clock(),
    // initialPosition: [0, 0, 0],
    initialPosition: [0, 60, 410],
    introDuration: 10, // seconds for intro
    isIntroStarted: false,
    isIntroComplete: false,
    emitter: new EventTarget(),
    animationQueue: [],
    backgroundMusic: undefined!,
    init: function () {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        // this.createFallingStars();


    },
    createGradientTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Deeper saffron & darker overall gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#361601ff');   // very dark saffron-brown glow
            gradient.addColorStop(0.3, '#f17d08ff'); // deep earthy orange
            gradient.addColorStop(0.7, '#1a0d0d'); // almost maroon-black
            gradient.addColorStop(1, '#000000');   // pure cosmic black


            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }


        return new THREE.CanvasTexture(canvas);
    },

    createScene() {
        // Scene
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x000000);
        scene.background = this.createGradientTexture();
        scene.fog = new THREE.FogExp2(0xff6600, 0.001); // saffron-tinted fog
        this.scene = scene;
    },

    createCamera() {
        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera = camera;
    },
    createRenderer() {

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5; // brighten up
        document.body.appendChild(renderer.domElement);

        this.renderer = renderer;
    },
    createControls() {
        if (this.camera && this.renderer) {
            // Controls
            const controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls = controls;
        }
    },

    createFallingStars() {
        // Create falling stars group
        const fallingStars = new THREE.Group();
        // Add some initial stars
        for (let i = 0; i < 40; i++) {
            fallingStars.add(createFallingStar());
        }
        this.scene.add(fallingStars);
        this.animationQueue.push({
            animate: () => {
                fallingStars.children.forEach((star, i) => {
                    star.position.add(star.userData.velocity);

                    // Reset when they go too low
                     if (star.position.y < -50) {
      star.position.y = 400; // reset high
      star.position.x = (Math.random() - 0.5) * 600;
      star.position.z = -300 - Math.random() * 500;
    }
                });
            }
        })
    },

    playBackgroundMusic() {
        if (SceneManager.backgroundMusic.current) {
            SceneManager.backgroundMusic.current.currentTime = 30;
            SceneManager.backgroundMusic.current.volume = 0.2;
            SceneManager.backgroundMusic.current?.play()
        }
    },



    animate: function () {
        requestAnimationFrame(this.animate.bind(this));
        this.animationQueue.forEach(({ animate }) => {
            animate();
        })
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
} 