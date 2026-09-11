'use client';

import React from 'react';

interface TomatoTopping3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function TomatoTopping3D({ position, rotation = [0, 0, 0] }: TomatoTopping3DProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Glossy Red Cherry Tomato Half */}
      <mesh castShadow>
        <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#B71C1C"
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
