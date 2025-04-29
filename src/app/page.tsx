"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LiquidType } from "@/types/liquid";
import Controls from "@/components/Controls/Controls";
import InfoPanel from "@/components/UI/InfoPanel";

// Import the CapillaryScene component with dynamic loading and SSR disabled
// This prevents issues with Three.js when the component is server-rendered
const CapillaryScene = dynamic(
  () => import("@/components/CapillaryTube/CapillaryScene"),
  { ssr: false }
);

export default function Home() {
  // State for the simulation
  const [liquidType, setLiquidType] = useState<LiquidType>("water");
  const [fillLevel, setFillLevel] = useState(0.6);

  // Handler functions
  const handleLiquidTypeChange = (newType: LiquidType) => {
    setLiquidType(newType);
  };

  const handleFillLevelChange = (newLevel: number) => {
    setFillLevel(newLevel);
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-8 font-sans bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
            <CapillaryScene
              liquidType={liquidType}
              fillLevel={fillLevel}
              tubeHeight={5}
              tubeRadius={0.2}
            />

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

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Created with Next.js, TypeScript, and Three.js</p>
        </footer>
      </main>
    </div>
  );
}
