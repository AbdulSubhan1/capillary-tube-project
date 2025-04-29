"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Grid,
  Plane,
} from "@react-three/drei";
import * as THREE from "three";
import { WaveSettings, MEDIUM_PROPERTIES } from "@/types/wave";

// Wave Mesh component that visualizes the wave
function WaveMesh({ settings }: { settings: WaveSettings }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef<number>(0);
  const wireframeRef = useRef<THREE.Mesh>(null!);

  // Generate the wave geometry based on settings
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(10, 10, settings.points, settings.points);
  }, [settings.points]);

  // Update the wave animation
  useFrame((_, delta) => {
    // Increment time
    timeRef.current += delta * settings.frequency;

    // Get the position attribute from the geometry
    const positions = meshRef.current.geometry.attributes.position;

    // Also update the wireframe if it exists
    const wireframePositions =
      wireframeRef.current?.geometry.attributes.position;

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

      // Update wireframe positions if they exist
      if (wireframePositions) {
        wireframePositions.setY(i, waveHeight);
      }
    }

    // Flag the attribute for update
    positions.needsUpdate = true;

    // Update wireframe
    if (wireframePositions) {
      wireframePositions.needsUpdate = true;
      wireframeRef.current.geometry.computeVertexNormals();
    }

    // Update normals for proper lighting
    meshRef.current.geometry.computeVertexNormals();
  });

  // Set up colors based on the medium
  const mediumColor = MEDIUM_PROPERTIES[settings.medium].color;

  // Create more vibrant colors for better visibility
  const mainColor = useMemo(() => {
    const color = new THREE.Color(mediumColor);
    if (settings.medium !== "string") {
      // Make colors more vibrant for non-string mediums
      return color.offsetHSL(0, 0.2, 0.1);
    }
    return color;
  }, [settings.medium, mediumColor]);

  const highlightColor = useMemo(() => {
    return new THREE.Color(mediumColor).offsetHSL(0.1, 0.5, 0.2);
  }, [mediumColor]);

  // Determine material properties based on medium
  const getMaterialProps = () => {
    switch (settings.medium) {
      case "water":
        return {
          color: mainColor,
          emissive: mainColor,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.8,
          roughness: 0.1,
          metalness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          side: THREE.DoubleSide,
          wireframe: false,
        };
      case "air":
        return {
          color: mainColor,
          emissive: mainColor,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.3,
          roughness: 0.7,
          metalness: 0.1,
          side: THREE.DoubleSide,
          wireframe: false,
        };
      case "metal":
        return {
          color: mainColor,
          emissive: mainColor,
          emissiveIntensity: 0.3,
          transparent: false,
          roughness: 0.1,
          metalness: 0.9,
          clearcoat: 0.5,
          reflectivity: 1,
          side: THREE.DoubleSide,
          wireframe: false,
        };
      case "string":
      default:
        return {
          color: mainColor,
          emissive: mainColor,
          emissiveIntensity: 0.5,
          wireframe: true,
          side: THREE.DoubleSide,
        };
    }
  };

  const materialProps = getMaterialProps();
  const isWireframe = settings.medium === "string";

  return (
    <group>
      {/* Main wave surface */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Always add a wireframe outline for better visibility */}
      {!isWireframe && (
        <mesh
          ref={wireframeRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
        >
          <primitive object={geometry.clone()} attach="geometry" />
          <meshBasicMaterial
            color={highlightColor}
            wireframe={true}
            transparent={true}
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Add particle system for air medium to enhance visibility but with reduced brightness */}
      {settings.medium === "air" && (
        <pointsMaterial
          attach="material"
          size={0.1}
          sizeAttenuation={true}
          color={highlightColor}
          transparent={true}
          opacity={0.4}
        />
      )}

      {/* Add reflective plane underneath for water */}
      {settings.medium === "water" && (
        <Plane
          args={[10, 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
        >
          <meshStandardMaterial
            color={mainColor}
            emissive={mainColor}
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.1}
          />
        </Plane>
      )}
    </group>
  );
}

// Main WaveScene component
export default function WaveScene({ settings }: { settings: WaveSettings }) {
  // Create a gradient background color based on the medium
  const bgColor = useMemo(() => {
    return {
      air: "#f0f8ff",
      water: "#004080",
      metal: "#303030",
      string: "#000000",
    }[settings.medium];
  }, [settings.medium]);

  return (
    <div
      className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg"
      style={{ background: bgColor }}
    >
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
        {/* Lighting - enhanced for better visibility */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 10, -5]} intensity={2} />
        <spotLight
          position={[0, 10, 0]}
          intensity={2}
          angle={0.6}
          penumbra={1}
          castShadow
        />

        {/* Add hemisphere light for better ambient lighting */}
        <hemisphereLight
          args={[0xffffff, 0x444444]}
          intensity={1}
          position={[0, 20, 0]}
        />

        {/* Environment - using a more visible preset */}
        <Environment preset="sunset" background={false} />

        {/* Ground plane for better context - change color based on medium */}
        <Plane
          args={[30, 30]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color={
              settings.medium === "water"
                ? "#001a33"
                : settings.medium === "metal"
                ? "#1a1a1a"
                : settings.medium === "air"
                ? "#e6f2ff"
                : "#000000"
            }
            roughness={0.8}
          />
        </Plane>

        {/* Grid helper - always visible now but with medium-specific colors */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.6}
          cellColor={
            settings.medium === "water"
              ? "#0077b3"
              : settings.medium === "metal"
              ? "#666666"
              : settings.medium === "air"
              ? "#99ccef"
              : "#6f6f6f"
          }
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor={
            settings.medium === "water"
              ? "#00a3e6"
              : settings.medium === "metal"
              ? "#999999"
              : settings.medium === "air"
              ? "#77aadd"
              : "#9d4b4b"
          }
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
