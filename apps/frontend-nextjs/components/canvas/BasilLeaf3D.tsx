'use client';

import React from 'react';

interface BasilLeaf3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function BasilLeaf3D({ position, rotation = [0, 0, 0], scale = 1 }: BasilLeaf3DProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Curved Basil Leaf Mesh */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.22, 0.02, 12]} />
        <meshStandardMaterial
          color="#008C45"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
