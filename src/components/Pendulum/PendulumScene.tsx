"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Sphere,
  Cylinder,
} from "@react-three/drei";
import * as THREE from "three";
import { PendulumProps } from "@/types/pendulum";

// Pendulum component that handles the physics simulation
function Pendulum({
  length,
  mass,
  initialAngle,
  gravity,
  damping,
}: PendulumProps) {
  const bobRef = useRef<THREE.Mesh>(null!);
  const stringRef = useRef<THREE.Mesh>(null!);

  // State to track the pendulum physics
  const physicsRef = useRef({
    angle: initialAngle,
    angularVelocity: 0,
    angularAcceleration: 0,
    lastTime: 0,
  });

  // Update the string position and rotation
  const updateStringPosition = (angle: number) => {
    if (stringRef.current) {
      // Position the string at half its length (as a pivot point)
      const pivotPoint = new THREE.Vector3(0, 0, 0);
      const bobPosition = new THREE.Vector3(
        Math.sin(angle) * length,
        -Math.cos(angle) * length,
        0
      );

      // Calculate the midpoint between pivot and bob for string position
      const midPoint = new THREE.Vector3()
        .addVectors(pivotPoint, bobPosition)
        .multiplyScalar(0.5);

      // Set string position to midpoint
      stringRef.current.position.copy(midPoint);

      // Calculate the angle for the string (pointing from pivot to bob)
      const angleToVertical = Math.atan2(
        bobPosition.x - pivotPoint.x,
        bobPosition.y - pivotPoint.y
      );

      // Rotate the string to align with the pendulum angle
      stringRef.current.rotation.z = angleToVertical;
    }
  };

  // Physics update for the pendulum
  useFrame((_, delta) => {
    const physics = physicsRef.current;

    // Calculate angular acceleration based on pendulum physics
    physics.angularAcceleration =
      -(gravity / length) * Math.sin(physics.angle) -
      damping * physics.angularVelocity;

    // Update angular velocity
    physics.angularVelocity += physics.angularAcceleration * delta;

    // Update angle
    physics.angle += physics.angularVelocity * delta;

    // Update bob position
    if (bobRef.current) {
      bobRef.current.position.x = Math.sin(physics.angle) * length;
      bobRef.current.position.y = -Math.cos(physics.angle) * length;
    }

    // Update string position and rotation
    updateStringPosition(physics.angle);
  });

  // Initialize the pendulum position on mount
  useEffect(() => {
    if (bobRef.current) {
      bobRef.current.position.x = Math.sin(initialAngle) * length;
      bobRef.current.position.y = -Math.cos(initialAngle) * length;
    }

    updateStringPosition(initialAngle);

    // Reset physics when props change
    physicsRef.current = {
      angle: initialAngle,
      angularVelocity: 0,
      angularAcceleration: 0,
      lastTime: 0,
    };
  }, [initialAngle, length]);

  // Scale the bob size based on mass
  const bobSize = useMemo(() => {
    return Math.max(0.1, Math.min(0.5, mass * 0.2));
  }, [mass]);

  // Calculate the string's dimensions
  const stringDimensions = useMemo(() => {
    return {
      radius: 0.01,
      height: length,
    };
  }, [length]);

  return (
    <group>
      {/* Pendulum pivot point */}
      <Sphere args={[0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888888" />
      </Sphere>

      {/* Pendulum string */}
      <Cylinder
        ref={stringRef}
        args={[
          stringDimensions.radius,
          stringDimensions.radius,
          stringDimensions.height,
          16,
        ]}
      >
        <meshStandardMaterial color="#444444" />
      </Cylinder>

      {/* Pendulum bob */}
      <Sphere
        ref={bobRef}
        args={[bobSize]}
        position={[
          Math.sin(initialAngle) * length,
          -Math.cos(initialAngle) * length,
          0,
        ]}
      >
        <meshStandardMaterial color="#e74c3c" metalness={0.6} roughness={0.2} />
      </Sphere>
    </group>
  );
}

interface PendulumSceneProps {
  length: number;
  mass: number;
  initialAngle: number;
  gravity: number;
  damping: number;
}

export default function PendulumScene({
  length,
  mass,
  initialAngle,
  gravity,
  damping,
}: PendulumSceneProps) {
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
        camera={{ position: [4, 0, 4], fov: 35 }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.6} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.25}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Environment */}
        <Environment preset="city" background={false} />

        {/* Pendulum */}
        <Pendulum
          length={length}
          mass={mass}
          initialAngle={initialAngle}
          gravity={gravity}
          damping={damping}
        />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -length - 0.5, 0]}
          opacity={0.6}
          scale={8}
          blur={1.5}
          far={8}
          resolution={256}
          color="#000000"
        />

        {/* Camera Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          minDistance={3}
          maxDistance={10}
          target={[0, -length / 2, 0]}
          enablePan={true}
          panSpeed={0.5}
          rotateSpeed={0.7}
        />

        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[4, 0, 4]}
          fov={35}
          near={0.1}
          far={100}
        />
      </Canvas>
    </div>
  );
}
