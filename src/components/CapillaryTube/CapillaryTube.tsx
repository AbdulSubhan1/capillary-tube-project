"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { LiquidType } from "@/types/liquid";

interface CapillaryTubeProps {
  liquidType: LiquidType;
  fillLevel: number; // 0 to 1
  tubeHeight: number;
  tubeRadius: number;
}

export default function CapillaryTube({
  liquidType,
  fillLevel,
  tubeHeight = 5,
  tubeRadius = 0.2,
}: CapillaryTubeProps) {
  // References to the objects
  const tubeRef = useRef<THREE.Mesh>(null!);
  const liquidRef = useRef<THREE.Mesh>(null!);
  const meniscusRef = useRef<THREE.Mesh>(null!);

  // Calculate liquid properties based on type
  const liquidProperties = useMemo(() => {
    const properties = {
      color: new THREE.Color(),
      meniscusHeight: 0,
      meniscusType: "concave", // or 'convex'
      viscosity: 1,
      opacity: 0.8,
    };

    switch (liquidType) {
      case "water":
        properties.color.set("#3498db");
        properties.meniscusHeight = 0.05;
        properties.meniscusType = "concave";
        properties.viscosity = 1;
        properties.opacity = 0.8;
        break;
      case "mercury":
        properties.color.set("#bdc3c7");
        properties.meniscusHeight = 0.03;
        properties.meniscusType = "convex";
        properties.viscosity = 1.5;
        properties.opacity = 1;
        break;
      case "oil":
        properties.color.set("#f1c40f");
        properties.meniscusHeight = 0.02;
        properties.meniscusType = "concave";
        properties.viscosity = 2;
        properties.opacity = 0.7;
        break;
      case "alcohol":
        properties.color.set("#e74c3c");
        properties.meniscusHeight = 0.06;
        properties.meniscusType = "concave";
        properties.viscosity = 0.8;
        properties.opacity = 0.75;
        break;
      default:
        properties.color.set("#3498db");
        properties.meniscusHeight = 0.05;
        properties.meniscusType = "concave";
    }

    return properties;
  }, [liquidType]);

  // Calculate the height of the liquid - properly calculate based on fill level
  const liquidHeight = useMemo(() => {
    return tubeHeight * fillLevel;
  }, [tubeHeight, fillLevel]);

  console.log("Liquid height calculation:", {
    tubeHeight,
    fillLevel,
    liquidHeight,
  });

  // Log when liquid height changes
  useEffect(() => {
    console.log("Liquid height updated:", {
      fillLevel,
      liquidHeight,
      liquidType,
    });

    // Force immediate update of mesh positions
    if (liquidRef.current && meniscusRef.current) {
      liquidRef.current.position.y = -tubeHeight / 2 + liquidHeight / 2;
      meniscusRef.current.position.y = -tubeHeight / 2 + liquidHeight;
    }
  }, [fillLevel, liquidHeight, liquidType, tubeHeight]);

  // Also update the geometry when fill level changes
  useEffect(() => {
    if (liquidRef.current) {
      // Update the cylinder geometry with new height
      const newGeometry = new THREE.CylinderGeometry(
        tubeRadius * 0.95,
        tubeRadius * 0.95,
        liquidHeight,
        32
      );

      liquidRef.current.geometry.dispose();
      liquidRef.current.geometry = newGeometry;
    }
  }, [liquidHeight, tubeRadius]);

  // Add subtle animation to simulate liquid movement
  useFrame((state) => {
    try {
      if (liquidRef.current && meniscusRef.current && fillLevel > 0) {
        // Add subtle oscillation to simulate liquid surface tension
        const time = state.clock.getElapsedTime();
        const oscillation =
          (Math.sin(time * 2) * 0.0015) / liquidProperties.viscosity;

        // Apply oscillation to the liquid height
        liquidRef.current.position.y =
          -tubeHeight / 2 + liquidHeight / 2 + oscillation;

        // Apply oscillation to the meniscus position
        meniscusRef.current.position.y =
          -tubeHeight / 2 + liquidHeight + oscillation;
      }
    } catch (error) {
      console.error("Error in animation frame:", error);
    }
  });

  // Create meniscus shape
  const meniscusGeometry = useMemo(() => {
    try {
      const mShape = new THREE.Shape();
      const radius = tubeRadius * 0.95; // Slightly smaller than tube radius
      const segments = 64;
      const meniscusHeight = liquidProperties.meniscusHeight;

      if (liquidProperties.meniscusType === "concave") {
        // Create concave meniscus (higher at edges)
        mShape.moveTo(-radius, 0);
        for (let i = 0; i <= segments; i++) {
          const angle = Math.PI * (i / segments);
          const x = -radius + 2 * radius * (i / segments);
          const y = meniscusHeight * Math.sin(angle);
          mShape.lineTo(x, y);
        }
      } else {
        // Create convex meniscus (higher in middle)
        mShape.moveTo(-radius, 0);
        for (let i = 0; i <= segments; i++) {
          const angle = Math.PI * (i / segments);
          const x = -radius + 2 * radius * (i / segments);
          const y = meniscusHeight * (1 - Math.sin(angle));
          mShape.lineTo(x, y);
        }
      }

      const extrudeSettings = {
        steps: 1,
        depth: 0.001,
        bevelEnabled: false,
      };

      return new THREE.ExtrudeGeometry(mShape, extrudeSettings);
    } catch (error) {
      console.error("Error creating meniscus geometry:", error);
      // Return a simple flat geometry as fallback
      const shape = new THREE.Shape();
      shape.moveTo(-tubeRadius, 0);
      shape.lineTo(tubeRadius, 0);
      return new THREE.ExtrudeGeometry(shape, {
        depth: 0.001,
        bevelEnabled: false,
      });
    }
  }, [liquidProperties, tubeRadius]);

  return (
    <group>
      {/* Glass tube */}
      <Cylinder
        ref={tubeRef}
        args={[tubeRadius, tubeRadius, tubeHeight, 32, 1, true]}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent={true}
          transmission={0.92}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
          thickness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false} // Important for proper transparency
        />
      </Cylinder>

      {/* Tube caps (top and bottom) */}
      <Cylinder
        args={[tubeRadius, tubeRadius, 0.01, 32]}
        position={[0, tubeHeight / 2, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
        />
      </Cylinder>

      <Cylinder
        args={[tubeRadius, tubeRadius, 0.01, 32]}
        position={[0, -tubeHeight / 2, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={1.5}
        />
      </Cylinder>

      {/* Liquid - render with higher opacity and proper intensity */}
      {fillLevel > 0 && (
        <Cylinder
          ref={liquidRef}
          args={[tubeRadius * 0.95, tubeRadius * 0.95, liquidHeight, 32]}
          position={[0, -tubeHeight / 2 + liquidHeight / 2, 0]}
        >
          <meshStandardMaterial
            color={liquidProperties.color}
            transparent={true}
            opacity={liquidProperties.opacity + 0.2} // Increase opacity slightly
            roughness={0.1}
            emissive={liquidProperties.color} // Add subtle emission for better visibility
            emissiveIntensity={0.15}
          />
        </Cylinder>
      )}

      {/* Meniscus (liquid surface) */}
      {fillLevel > 0 && (
        <mesh
          ref={meniscusRef}
          geometry={meniscusGeometry}
          position={[0, -tubeHeight / 2 + liquidHeight, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color={liquidProperties.color}
            transparent={true}
            opacity={liquidProperties.opacity + 0.2} // Match the opacity increase
            roughness={0.1}
            side={THREE.DoubleSide}
            emissive={liquidProperties.color}
            emissiveIntensity={0.15}
          />
        </mesh>
      )}

      {/* Measurement scale */}
      <group position={[tubeRadius * 1.5, 0, 0]} rotation={[0, 0, 0]}>
        {/* Scale line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, tubeHeight, 0.01]} />
          <meshStandardMaterial color="#444444" />
        </mesh>

        {/* Scale markings - create 10 marks */}
        {Array.from({ length: 11 }).map((_, i) => (
          <group
            key={i}
            position={[0, -tubeHeight / 2 + (i * tubeHeight) / 10, 0]}
          >
            <mesh position={[0.05, 0, 0]}>
              <boxGeometry args={[0.1, 0.01, 0.01]} />
              <meshStandardMaterial color="#444444" />
            </mesh>

            {/* Only add text for every other marking */}
            {i % 2 === 0 && (
              <mesh position={[0.15, 0, 0]}>
                <boxGeometry args={[0.01, 0.01, 0.01]} />
                <meshStandardMaterial color="#444444" />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
