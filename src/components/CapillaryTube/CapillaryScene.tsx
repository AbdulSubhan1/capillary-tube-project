"use client";

import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  useHelper,
} from "@react-three/drei";
import * as THREE from "three";
import CapillaryTube from "./CapillaryTube";
import { LiquidType } from "@/types/liquid";

interface CapillarySceneProps {
  liquidType: LiquidType;
  fillLevel: number;
  tubeHeight?: number;
  tubeRadius?: number;
}

export default function CapillaryScene({
  liquidType,
  fillLevel,
  tubeHeight = 5,
  tubeRadius = 0.2,
}: CapillarySceneProps) {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <Canvas dpr={[1, 2]}>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[2, 0, 5]} fov={40} />

        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <spotLight
          position={[10, 10, 5]}
          angle={0.15}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          position={[-10, -10, -5]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
        />

        {/* Environment for realistic reflections */}
        <Environment preset="city" />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -tubeHeight / 2 - 0.1, 0]}
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />

        {/* Our capillary tube */}
        <CapillaryTube
          liquidType={liquidType}
          fillLevel={fillLevel}
          tubeHeight={tubeHeight}
          tubeRadius={tubeRadius}
        />

        {/* Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          minDistance={3}
          maxDistance={8}
        />

        {/* Helpers for positioning (visible only during development) */}
        <SceneHelpers visible={false} tubeHeight={tubeHeight} />
      </Canvas>
    </div>
  );
}

// Helper component with grid and axes
function SceneHelpers({ visible = false, tubeHeight = 5 }) {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const axesRef = useRef<THREE.AxesHelper>(null!);

  if (!visible) return null;

  return (
    <>
      <gridHelper
        ref={gridRef}
        args={[10, 10, "#666666", "#222222"]}
        position={[0, -tubeHeight / 2 - 0.1, 0]}
      />
      <axesHelper ref={axesRef} args={[5]} />
    </>
  );
}
