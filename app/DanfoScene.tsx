'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Danfo Bus Model using primitive geometries
function DanfoBus() {
  const busRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // Gentle road cruising bounce & wheel rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (busRef.current) {
      busRef.current.position.y = Math.sin(t * 8) * 0.03;
      busRef.current.rotation.z = Math.sin(t * 6) * 0.015;
    }
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach((w) => {
        w.rotation.x -= 0.12;
      });
    }
  });

  return (
    <group ref={busRef} position={[0, 0, 0]}>
      {/* Yellow Bus Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.5, 0.9, 2.8]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Signature Black Twin Racing Stripes */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.52, 0.12, 2.82]} />
        <meshStandardMaterial color="#171717" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.52, 0.08, 2.82]} />
        <meshStandardMaterial color="#171717" roughness={0.5} />
      </mesh>

      {/* Windshield / Windows */}
      <mesh position={[0, 0.9, 0.7]}>
        <boxGeometry args={[1.4, 0.45, 1.3]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.5, 0.5, 1.41]}>
        <boxGeometry args={[0.22, 0.15, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.5, 0.5, 1.41]}>
        <boxGeometry args={[0.22, 0.15, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.5} />
      </mesh>

      {/* Wheels */}
      <group ref={wheelsRef}>
        {/* Front Left */}
        <mesh position={[-0.78, 0.25, 0.85]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#262626" roughness={0.8} />
        </mesh>
        {/* Front Right */}
        <mesh position={[0.78, 0.25, 0.85]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#262626" roughness={0.8} />
        </mesh>
        {/* Rear Left */}
        <mesh position={[-0.78, 0.25, -0.85]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#262626" roughness={0.8} />
        </mesh>
        {/* Rear Right */}
        <mesh position={[0.78, 0.25, -0.85]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
          <meshStandardMaterial color="#262626" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// Low-poly Asphalt Road & Moving Lane Markings
function Expressway() {
  const dashesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (dashesRef.current) {
      dashesRef.current.children.forEach((dash) => {
        dash.position.z -= 0.08;
        if (dash.position.z < -4) {
          dash.position.z = 4;
        }
      });
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Road Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Concrete Road Curbs */}
      <mesh position={[-2.25, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.16, 12]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>
      <mesh position={[2.25, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.16, 12]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>

      {/* Moving Center Line Dashes */}
      <group ref={dashesRef}>
        {[-3, -1, 1, 3].map((z, i) => (
          <mesh key={i} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 0.9]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function DanfoScene() {
  return (
    <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 border border-neutral-800 relative shadow-inner">
      <div className="absolute top-2 left-3 z-10 pointer-events-none flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        3D Third Mainland View • Drag to Orbit
      </div>

      <Canvas
        camera={{ position: [3.5, 2.5, 4.2], fov: 42 }}
        shadows
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#38bdf8" />

        <DanfoBus />
        <Expressway />

        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}