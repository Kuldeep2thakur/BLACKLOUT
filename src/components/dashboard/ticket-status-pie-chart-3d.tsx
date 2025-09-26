'use client';

import * as React from 'react';
import * as THREE from 'three';
import type { Ticket, TicketStatus } from '@/types';

interface TicketStatusPieChart3DProps {
  tickets: Ticket[];
}

const statusColors: Record<TicketStatus, THREE.Color> = {
  Resolved: new THREE.Color('hsl(111, 100%, 54%)'), // accent
  'In Progress': new THREE.Color('hsl(198, 93%, 60%)'), // blue
  Pending: new THREE.Color('hsl(43, 74%, 66%)'), // yellow
};

export const TicketStatusPieChart3D: React.FC<TicketStatusPieChart3DProps> = ({ tickets }) => {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);

  const data = React.useMemo(() => {
    const counts: Record<TicketStatus, number> = {
      'Pending': 0,
      'In Progress': 0,
      'Resolved': 0,
    };
    tickets.forEach(ticket => {
      counts[ticket.status]++;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({ status: status as TicketStatus, count }))
      .filter(item => item.count > 0);
  }, [tickets]);

  React.useEffect(() => {
    if (!mountRef.current || !data.length) return;

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

    const pieGroup = new THREE.Group();
    scene.add(pieGroup);

    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;

    const radius = 2;
    const height = 0.5;

    data.forEach(item => {
      const angle = (item.count / totalCount) * Math.PI * 2;
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, currentAngle, angle);
      const material = new THREE.MeshStandardMaterial({
        color: statusColors[item.status],
        metalness: 0.3,
        roughness: 0.6,
      });
      const slice = new THREE.Mesh(geometry, material);
      pieGroup.add(slice);
      currentAngle += angle;
    });

    pieGroup.rotation.x = Math.PI / 4;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    camera.position.z = 5;

    let mouseX = 0;
    const onMouseMove = (event: MouseEvent) => {
        const rect = currentMount.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
    };
    currentMount.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      if (!rendererRef.current) return;
      requestAnimationFrame(animate);
      pieGroup.rotation.y += 0.002;
      pieGroup.rotation.y += (mouseX * 0.5 - pieGroup.rotation.y) * 0.02;
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
  }, [data]);

  return <div ref={mountRef} className="h-full w-full" />;
};
