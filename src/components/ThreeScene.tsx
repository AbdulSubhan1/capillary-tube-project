"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// Define an interface for the Box props
interface BoxProps {
  position: [number, number, number];
  // Replace [key: string]: any with more specific optional props
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  scale?: number | [number, number, number];
}

function Box(props: BoxProps) {
  // This reference gives us direct access to the mesh
  const meshRef = useRef<THREE.Mesh>(null!);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      position={props.position}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[400px]">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
