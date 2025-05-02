'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CanvasManager() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const controls = useAnimationControls();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname);
  const burstRef = useRef({ active: false, time: 0 });
  const spinRef = useRef({ active: false, time: 0, spinSpeed: 0 });
  const scrollProgress = useRef(0); // Track scroll progress

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scene Setup
    const scene = sceneRef.current;
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Torus (Initial Shape)
    const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Target shape for scroll effect
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torusRef.current = torus;
    scene.add(torus);

    // Particles
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
      velocities[i] = (Math.random() - 0.5) * 0.002;
      velocities[i + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i + 2] = (Math.random() - 0.5) * 0.002;
      colors[i] = 1;
      colors[i + 1] = 1;
      colors[i + 2] = 1;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // Mouse Interaction
    const mouseVector = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.x = mouseVector.x;
      mouse.current.y = mouseVector.y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Effect
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(scrollTop / docHeight, 1); // 0 to 1 based on scroll position
      scrollProgress.current = scrollFraction;

      // Update Torus Scale and Morph
      if (torusRef.current) {
        const scale = 1 + scrollFraction * 2; // Scale from 1 to 3
        torusRef.current.scale.set(scale, scale, scale);
      }

      // Update Particles Spread and Opacity
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const material = particlesRef.current.material as THREE.PointsMaterial;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const spread = 10 + scrollFraction * 5; // Spread particles wider as you scroll
          if (Math.abs(positions[i]) > spread) velocities[i] *= -0.8;
          if (Math.abs(positions[i + 1]) > spread) velocities[i + 1] *= -0.8;
          if (Math.abs(positions[i + 2]) > spread) velocities[i + 2] *= -0.8;
        }
        material.opacity = 1 - scrollFraction * 0.5; // Fade particles slightly as you scroll
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      if (torusRef.current) {
        torusRef.current.rotation.x = mouse.current.y * Math.PI * 0.5;
        torusRef.current.rotation.y = mouse.current.x * Math.PI * 0.5;
        if (spinRef.current.active) {
          spinRef.current.time += 0.016;
          torusRef.current.rotation.x += spinRef.current.spinSpeed;
          torusRef.current.rotation.y += spinRef.current.spinSpeed;
          if (spinRef.current.time > 1) {
            spinRef.current.active = false;
            spinRef.current.time = 0;
            spinRef.current.spinSpeed = 0;
          }
        }
      }
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const material = particlesRef.current.material as THREE.PointsMaterial;

        if (burstRef.current.active) {
          burstRef.current.time += 0.016;
          for (let i = 0; i < particleCount * 3; i += 3) {
            velocities[i] *= 1.03;
            velocities[i + 1] *= 1.03;
            velocities[i + 2] *= 1.03;
          }
          if (burstRef.current.time > 0.7) {
            burstRef.current.active = false;
            burstRef.current.time = 0;
          }
        }

        if (currentPage === '/') {
          for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
          }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        material.opacity = currentPage === '/' ? 1 - scrollProgress.current * 0.5 : 0.8;
      }

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
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle Route Changes
  useEffect(() => {
    setCurrentPage(pathname);
    if (pathname === '/') {
      spinRef.current.active = true;
      spinRef.current.time = 0;
      spinRef.current.spinSpeed = 0.15;
      controls.start({
        torusScale: 1,
        particlesOpacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 15 },
      });
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] = (Math.random() - 0.5) * 10;
          positions[i + 1] = (Math.random() - 0.5) * 10;
          positions[i + 2] = (Math.random() - 0.5) * 10;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [pathname, controls]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-1"
      style={{ background: 'transparent' }}
      custom={{ torusRef, particlesRef }}
      animate={controls}
      onUpdate={(latest) => {
        if (torusRef.current) {
          torusRef.current.scale.set(latest.torusScale, latest.torusScale, latest.torusScale);
        }
        if (particlesRef.current) {
          const material = particlesRef.current.material as THREE.PointsMaterial;
          material.opacity = latest.particlesOpacity;
        }
      }}
    />
  );
}