'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import throttle from 'lodash.throttle';

export default function CanvasManager() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const burstRef = useRef({ active: false, time: 0 });
  const spinRef = useRef({ active: false, time: 0, spinSpeed: 0 });
  const scrollProgress = useRef(0);
  const isVisible = useRef(true);
  const lastTime = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = sceneRef.current;
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true, antialias: false });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
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
    const particleCount = 240;
    const particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
      velocities[i] = (Math.random() - 0.5) * 0.005; // Increased velocity
      velocities[i + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.005;
      colors[i] = 0.8; // Slightly teal-tinted for contrast
      colors[i + 1] = 1;
      colors[i + 2] = 1;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.72,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // Mouse Interaction (throttled)
    const mouseVector = new THREE.Vector2();
    const handleMouseMove = throttle((event: MouseEvent) => {
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.x = mouseVector.x;
      mouse.current.y = mouseVector.y;
    }, 16);
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Effect (throttled)
    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(scrollTop / docHeight, 1);
      scrollProgress.current = scrollFraction;

      if (torusRef.current && !reducedMotion) {
        const scale = 1 + scrollFraction * 2;
        torusRef.current.scale.set(scale, scale, scale);
      }

      if (particlesRef.current && !reducedMotion) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const material = particlesRef.current.material as THREE.PointsMaterial;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const spread = 10 + scrollFraction * 5;
          if (Math.abs(positions[i]) > spread) velocities[i] *= -0.8;
          if (Math.abs(positions[i + 1]) > spread) velocities[i + 1] *= -0.8;
          if (Math.abs(positions[i + 2]) > spread) velocities[i + 2] *= -0.8;
        }
        material.opacity = 1 - scrollFraction * 0.5;
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }, 16);
    window.addEventListener('scroll', handleScroll);

    // Visibility Detection
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation Loop (delta-time based)
    let animationFrameId: number;
    const animate = (time: number) => {
      if (!isVisible.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;

      if (torusRef.current) {
        torusRef.current.rotation.x = mouse.current.y * Math.PI * 0.5;
        torusRef.current.rotation.y = mouse.current.x * Math.PI * 0.5;
        if (spinRef.current.active) {
          spinRef.current.time += delta;
          torusRef.current.rotation.x += spinRef.current.spinSpeed * delta * 60;
          torusRef.current.rotation.y += spinRef.current.spinSpeed * delta * 60;
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
          burstRef.current.time += delta;
          for (let i = 0; i < particleCount * 3; i += 3) {
            velocities[i] *= 1 + 0.03 * delta * 60;
            velocities[i + 1] *= 1 + 0.03 * delta * 60;
            velocities[i + 2] *= 1 + 0.03 * delta * 60;
          }
          if (burstRef.current.time > 0.7) {
            burstRef.current.active = false;
            burstRef.current.time = 0;
          }
        }

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i] * delta * 60;
          positions[i + 1] += velocities[i + 1] * delta * 60;
          positions[i + 2] += velocities[i + 2] * delta * 60;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        material.opacity = 0.72 - scrollProgress.current * 0.3;

        // Optional: Pulse particle size for visibility (comment out if not desired)
        material.size = 0.055 + Math.sin(time * 0.002) * 0.012;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    // Handle Resize (throttled)
    const handleResize = throttle(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleMouseMove.cancel();
      handleScroll.cancel();
      handleResize.cancel();
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js resources
      if (torusRef.current) {
        const torus = torusRef.current;
        torus.geometry.dispose();
        (torus.material as THREE.Material).dispose();
        scene.remove(torus);
      }
      if (particlesRef.current) {
        const particles = particlesRef.current;
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
        scene.remove(particles);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-full w-full opacity-80"
      style={{ background: 'transparent' }}
    />
  );
}
