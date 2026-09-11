'use client';

import React from 'react';

interface ChampignonTopping3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function ChampignonTopping3D({ position, rotation = [0, 0, 0] }: ChampignonTopping3DProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Mushroom Cap Slice */}
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 16]} />
        <meshStandardMaterial
          color="#D7CCC8"
          roughness={0.7}
        />
      </mesh>
      {/* Mushroom Stem Fragment */}
      <mesh position={[0, -0.015, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
        <meshStandardMaterial
          color="#EFEBE9"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
