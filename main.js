import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "jsm/loaders/RGBELoader.js";

document.addEventListener("DOMContentLoaded", function () {
    // Get the container div
    const container = document.getElementById("three-container");
    if (!container) {
        console.error("Container div not found!");
        return;
    }

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-2, -1,4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Load HDRI for reflections
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("qwantani_noon_1k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = null;
    });

    // Lights
    // Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2); 
scene.add(ambientLight);

// Directional Lights (Sun-like light)
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(5, 10, 5);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight2.position.set(-5, -10, -5);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// Point Lights (Illuminate different sides)
const pointLight1 = new THREE.PointLight(0xffffff, 5);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 5);
pointLight2.position.set(-5, 5, -5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 5);
pointLight3.position.set(5, -5, 5);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 5);
pointLight4.position.set(-5, -5, -5);
scene.add(pointLight4);

// Spot Lights (Directional focus)
const spotLight1 = new THREE.SpotLight(0xffffff, 8);
spotLight1.position.set(0, 10, 0);
spotLight1.angle = Math.PI / 4;
spotLight1.castShadow = true;
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xffffff, 8);
spotLight2.position.set(0, -10, 0);
spotLight2.angle = Math.PI / 4;
spotLight2.castShadow = true;
scene.add(spotLight2);


    // Floor
    const floorGeometry = new THREE.PlaneGeometry(0, 0);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.receiveShadow = true;
    scene.add(floor);
    
    
    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load("iphne scene 1.glb", (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.envMapIntensity = 2;
            }
        });
        scene.add(gltf.scene);
    }, undefined, (error) => console.error(error));

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
    }
    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
});