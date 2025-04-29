"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  useHelper,
  useGLTF,
  BakeShadows,
  AccumulativeShadows,
  RandomizedLight,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";
import CapillaryTube from "./CapillaryTube";
import { LiquidType } from "@/types/liquid";

// Define types for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Custom error boundary component
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("3D Rendering Error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/30 p-4 rounded">
          <div className="text-center">
            <h2 className="text-red-600 dark:text-red-400 font-bold mb-2">
              3D Rendering Error
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              There was a problem rendering the 3D scene. Try refreshing the
              page or using a different browser.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {this.state.error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface CapillarySceneProps {
  liquidType: LiquidType;
  fillLevel: number;
  tubeHeight?: number;
  tubeRadius?: number;
}

// Debug component to log rendering status
function SceneDebugger() {
  useEffect(() => {
    console.log("3D Scene mounted successfully");
    return () => console.log("3D Scene unmounted");
  }, []);

  return null;
}

// Enhanced scene lighting setup
function SceneLighting() {
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.6} />

      {/* Main key light - positioned to show liquid */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.25}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Fill light from opposite side */}
      <spotLight
        position={[-5, 3, -5]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />

      {/* Rim light to highlight edges */}
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#b3e5fc" />

      {/* Bottom light to illuminate liquid from below */}
      <pointLight
        position={[0, -5, 0]}
        intensity={0.3}
        color="#ffffff"
        distance={10}
        decay={2}
      />
    </>
  );
}

export default function CapillaryScene({
  liquidType,
  fillLevel,
  tubeHeight = 5,
  tubeRadius = 0.2,
}: CapillarySceneProps) {
  // Add a state for renderer initialization
  const [isRendererInitialized, setIsRendererInitialized] = useState(false);

  // Log props changes to help with debugging
  useEffect(() => {
    console.log("CapillaryScene props updated:", {
      liquidType,
      fillLevel,
      tubeHeight,
      tubeRadius,
    });
  }, [liquidType, fillLevel, tubeHeight, tubeRadius]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <ErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
          }}
          shadows
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
            // Using newer encoding API for THREE.js
            gl.outputColorSpace = THREE.SRGBColorSpace;
            console.log("Canvas created successfully");
            setIsRendererInitialized(true);
          }}
        >
          <SceneDebugger />

          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[2.5, 0, 5]}
            fov={35}
            near={0.1}
            far={100}
          />

          {/* Enhanced lighting */}
          <SceneLighting />

          {/* Environment for realistic reflections */}
          <Suspense fallback={null}>
            <Environment preset="city" background={false} />
          </Suspense>

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -tubeHeight / 2 - 0.1, 0]}
            opacity={0.5}
            scale={10}
            blur={1.5}
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
            target={[0, 0, 0]}
          />

          {/* Helpers for positioning (visible only during development) */}
          <SceneHelpers visible={false} tubeHeight={tubeHeight} />

          {/* Preload assets */}
          <Preload all />

          {/* Bake shadows for better performance */}
          <BakeShadows />
        </Canvas>
      </ErrorBoundary>

      {!isRendererInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80">
          <p className="text-gray-800 dark:text-gray-200">
            Initializing 3D renderer...
          </p>
        </div>
      )}
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
