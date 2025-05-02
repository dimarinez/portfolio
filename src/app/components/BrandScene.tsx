'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BrandsScene() {
  const canvasRef = useRef();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Brand Logos (Mock Planes)
    const logos = [
      { id: 1, x: -2, color: 0xff0000 },
      { id: 2, x: 0, color: 0x0000ff },
      { id: 3, x: 2, color: 0xffff00 },
    ];
    const logoMeshes = [];
    logos.forEach((logo) => {
      const geometry = new THREE.PlaneGeometry(1.5, 1.5);
      const material = new THREE.MeshStandardMaterial({ color: logo.color, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(logo.x, 0, 0);
      mesh.userData = { id: logo.id };
      scene.add(mesh);
      logoMeshes.push(mesh);
    });

    camera.position.z = 5;

    // Raycaster for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedMesh = null;

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      if (selectedMesh) {
        console.log(`Clicked logo ${selectedMesh.userData.id}`);
        // Add custom action, e.g., open brand website
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      // Update raycaster
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(logoMeshes);
      logoMeshes.forEach((mesh) => {
        mesh.scale.set(1, 1, 1);
      });
      if (intersects.length > 0) {
        selectedMesh = intersects[0].object;
        selectedMesh.scale.set(1.2, 1.2, 1.2);
      } else {
        selectedMesh = null;
      }

      // Rotate logos
      logoMeshes.forEach((mesh, index) => {
        mesh.rotation.y += 0.01 * (index % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-[-1]" />;
}