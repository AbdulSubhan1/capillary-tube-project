"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { LiquidType } from "@/types/liquid";
import Controls from "@/components/Controls/Controls";
import InfoPanel from "@/components/UI/InfoPanel";

// Import the CapillaryScene component with dynamic loading and SSR disabled
const CapillaryScene = dynamic(
  () => import("@/components/CapillaryTube/CapillaryScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <p className="text-gray-600 dark:text-gray-300">Loading 3D scene...</p>
      </div>
    ),
  }
);

export default function CapillaryTubePage() {
  // State for the simulation
  const [liquidType, setLiquidType] = useState<LiquidType>("water");
  const [fillLevel, setFillLevel] = useState(0.6);
  const [key, setKey] = useState(Date.now()); // Force re-render key

  // Log state changes to help with debugging
  useEffect(() => {
    console.log("Capillary tube state updated:", { liquidType, fillLevel });
  }, [liquidType, fillLevel]);

  // Handler functions with useCallback to maintain reference stability
  const handleLiquidTypeChange = useCallback((newType: LiquidType) => {
    console.log("Liquid type changing to:", newType);
    setLiquidType(newType);
  }, []);

  const handleFillLevelChange = useCallback((newLevel: number) => {
    console.log("Fill level changing to:", newLevel);
    setFillLevel(newLevel);

    // If the newLevel is 0, force re-render to ensure proper reset
    if (newLevel === 0) {
      setKey(Date.now());
    }
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Capillary Tube Simulation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore how different liquids behave in a glass capillary tube.
            Adjust the liquid type and fill level to see changes in meniscus
            formation and capillary action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Simulation controls - left column on large screens */}
          <div className="lg:col-span-1 space-y-8">
            <Controls
              liquidType={liquidType}
              fillLevel={fillLevel}
              onLiquidTypeChange={handleLiquidTypeChange}
              onFillLevelChange={handleFillLevelChange}
            />

            <InfoPanel liquidType={liquidType} />
          </div>

          {/* 3D Simulation - main content area, spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">
                    Loading 3D scene...
                  </p>
                </div>
              }
            >
              <CapillaryScene
                key={key} // Force re-render when key changes
                liquidType={liquidType}
                fillLevel={fillLevel}
                tubeHeight={3}
                tubeRadius={0.15}
              />
            </Suspense>

            <div className="bg-white dark:bg-gray-800 mt-4 p-4 rounded-lg shadow-md text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-2">Interaction tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click and drag to rotate the view</li>
                <li>Scroll to zoom in/out</li>
                <li>Right-click and drag to pan</li>
                <li>Double-click to reset the view</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
