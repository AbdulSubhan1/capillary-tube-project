"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { WaveSettings, MEDIUM_PROPERTIES } from "@/types/wave";

// Wave Mesh component that visualizes the wave
function WaveMesh({ settings }: { settings: WaveSettings }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef<number>(0);

  // Generate the wave geometry based on settings
  const { geometry, initialPositions } = useMemo(() => {
    // Create a plane geometry for the wave surface
    const geo = new THREE.PlaneGeometry(
      10,
      10,
      settings.points,
      settings.points
    );

    // Store the initial positions for animation
    const positions = geo.attributes.position.array.slice();

    return { geometry: geo, initialPositions: positions };
  }, [settings.points]);

  // Update the wave animation
  useFrame((_, delta) => {
    // Increment time
    timeRef.current += delta * settings.frequency;

    // Get the position attribute from the geometry
    const positions = meshRef.current.geometry.attributes.position;

    // Apply the wave equation to each point in the mesh
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Distance from center
      const distance = Math.sqrt(x * x + z * z);

      // Wave speed based on medium
      const speed = MEDIUM_PROPERTIES[settings.medium].speed;

      // Calculate wave height using a sine wave equation
      const waveHeight =
        settings.amplitude *
        Math.sin(distance * 2 - timeRef.current * speed) *
        Math.exp(-settings.damping * distance);

      // Apply the calculated height
      positions.setY(i, waveHeight);
    }

    // Flag the attribute for update
    positions.needsUpdate = true;

    // Update normals for proper lighting
    meshRef.current.geometry.computeVertexNormals();
  });

  // Set up the color based on the wave medium
  const color = useMemo(() => {
    return new THREE.Color(MEDIUM_PROPERTIES[settings.medium].color);
  }, [settings.medium]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshPhysicalMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.8}
        roughness={0.3}
        metalness={0.2}
        wireframe={settings.medium === "string"}
      />
    </mesh>
  );
}

// Main WaveScene component
export default function WaveScene({ settings }: { settings: WaveSettings }) {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 10, -5]} intensity={1} />

        {/* Environment */}
        <Environment preset="city" background={false} />

        {/* Grid helper */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#9d4b4b"
          fadeDistance={25}
          fadeStrength={1}
          position={[0, -0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Wave Mesh */}
        <WaveMesh settings={settings} />

        {/* Camera Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          minPolarAngle={Math.PI / 10}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
          enablePan={true}
        />

        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[8, 8, 8]}
          fov={50}
          near={0.1}
          far={100}
        />
      </Canvas>
    </div>
  );
}
