'use client';

import * as React from 'react';
import * as THREE from 'three';

const HeroAnimationClient: React.FC = () => {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);

  React.useEffect(() => {
    if (!mountRef.current) return;

    if (rendererRef.current) {
        rendererRef.current.dispose();
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
        }
    }
    
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 30;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color('hsl(287, 58%, 53%)'), // primary
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    camera.position.z = 15;

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
        const rect = currentMount.getBoundingClientRect();
        mouseX = (event.clientX - rect.left - currentMount.clientWidth / 2) / (currentMount.clientWidth / 2);
        mouseY = (event.clientY - rect.top - currentMount.clientHeight / 2) / (currentMount.clientHeight / 2);
    };
    currentMount.addEventListener('mousemove', onMouseMove);
    
    const clock = new THREE.Clock();

    const animate = () => {
      if (!rendererRef.current) return;
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      particleSystem.rotation.y = elapsedTime * 0.05;
      
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = particleSystem.geometry.attributes.position.getX(i);
          positions[i3 + 1] += Math.sin(elapsedTime + x) * 0.001;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!currentMount) return;
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', onMouseMove);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
};

export const HeroAnimation: React.FC = () => {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <HeroAnimationClient /> : null;
}
