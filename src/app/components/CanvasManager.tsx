'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import throttle from 'lodash.throttle';

type MotionPermission = 'unavailable' | 'prompt' | 'active' | 'denied';

type DeviceOrientationPermissionConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function getScreenRelativeTilt(beta: number, gamma: number) {
  const legacyAngle = (window as Window & { orientation?: number }).orientation ?? 0;
  const angle = window.screen.orientation?.angle ?? legacyAngle;
  const normalizedAngle = ((angle % 360) + 360) % 360;

  if (normalizedAngle === 90) return { x: beta, y: -gamma };
  if (normalizedAngle === 180) return { x: -gamma, y: -beta };
  if (normalizedAngle === 270) return { x: -beta, y: gamma };
  return { x: gamma, y: beta };
}

export default function CanvasManager() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const interaction = useRef({ x: 0, y: 0 });
  const motionTarget = useRef({ active: false, x: 0, y: 0 });
  const motionBaseline = useRef<{ x: number; y: number } | null>(null);
  const burstRef = useRef({ active: false, time: 0 });
  const spinRef = useRef({ active: false, time: 0, spinSpeed: 0 });
  const scrollProgress = useRef(0);
  const isVisible = useRef(true);
  const lastTime = useRef(0);
  const [motionPermission, setMotionPermission] = useState<MotionPermission>('unavailable');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobilePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || !mobilePointer || !('DeviceOrientationEvent' in window)) return;

    setMotionPermission('prompt');
  }, []);

  useEffect(() => {
    if (motionPermission !== 'active') return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;

      const tilt = getScreenRelativeTilt(event.beta, event.gamma);
      if (!motionBaseline.current) {
        motionBaseline.current = tilt;
        motionTarget.current.active = true;
        return;
      }

      const range = 24;
      motionTarget.current.active = true;
      motionTarget.current.x = THREE.MathUtils.clamp((tilt.x - motionBaseline.current.x) / range, -1, 1);
      motionTarget.current.y = THREE.MathUtils.clamp((tilt.y - motionBaseline.current.y) / range, -1, 1);
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      motionTarget.current = { active: false, x: 0, y: 0 };
      motionBaseline.current = null;
    };
  }, [motionPermission]);

  const requestMotionAccess = async () => {
    const orientationEvent = DeviceOrientationEvent as DeviceOrientationPermissionConstructor;
    try {
      if (typeof orientationEvent.requestPermission === 'function') {
        const result = await orientationEvent.requestPermission();
        setMotionPermission(result === 'granted' ? 'active' : 'denied');
        return;
      }

      setMotionPermission('active');
    } catch {
      setMotionPermission('denied');
    }
  };

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

      const usingMotion = motionTarget.current.active;
      const targetX = usingMotion ? motionTarget.current.x : mouse.current.x;
      const targetY = usingMotion ? motionTarget.current.y : mouse.current.y;
      const follow = 1 - Math.exp(-delta * (usingMotion ? 7 : 11));
      interaction.current.x += (targetX - interaction.current.x) * follow;
      interaction.current.y += (targetY - interaction.current.y) * follow;

      if (torusRef.current) {
        const rotationRange = Math.PI * (usingMotion ? 0.34 : 0.5);
        torusRef.current.rotation.x = interaction.current.y * rotationRange;
        torusRef.current.rotation.y = interaction.current.x * rotationRange;
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

        const particleTiltX = usingMotion ? interaction.current.y * 0.12 : 0;
        const particleTiltY = usingMotion ? interaction.current.x * 0.18 : 0;
        particlesRef.current.rotation.x += (particleTiltX - particlesRef.current.rotation.x) * follow;
        particlesRef.current.rotation.y += (particleTiltY - particlesRef.current.rotation.y) * follow;
        particlesRef.current.position.x += ((usingMotion ? interaction.current.x * 0.18 : 0) - particlesRef.current.position.x) * follow;
        particlesRef.current.position.y += ((usingMotion ? interaction.current.y * 0.12 : 0) - particlesRef.current.position.y) * follow;

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
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1] h-full w-full opacity-80"
        style={{ background: 'transparent' }}
      />
      {motionPermission === 'prompt' && (
        <div
          role="dialog"
          aria-labelledby="motion-prompt-title"
          className="fixed inset-x-6 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[35] mx-auto max-w-sm border border-white/15 bg-[#171717]/92 p-5 text-white shadow-2xl backdrop-blur-xl sm:hidden"
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8fffe8]">Motion interaction</p>
          <p id="motion-prompt-title" className="mt-2 text-xl font-extralight leading-tight tracking-[-0.025em]">
            Move the scene with your phone.
          </p>
          <p className="mt-2 max-w-xs text-xs font-extralight leading-relaxed text-white/45">
            Enable tilt to give the background depth as you move.
          </p>
          <div className="mt-5 flex items-center gap-6">
            <button
              type="button"
              onClick={requestMotionAccess}
              className="flex min-h-11 items-center border-b border-[#8fffe8] font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fffe8] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8]"
            >
              Enable tilt ↗
            </button>
            <button
              type="button"
              onClick={() => setMotionPermission('denied')}
              className="flex min-h-11 items-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8fffe8]"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
