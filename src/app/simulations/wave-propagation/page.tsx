"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { WaveSettings, DEFAULT_WAVE_SETTINGS } from "@/types/wave";
import WaveControls from "@/components/Wave/WaveControls";
import InfoPanel from "@/components/Wave/InfoPanel";

// Import the WaveScene component with dynamic loading and SSR disabled
const WaveScene = dynamic(() => import("@/components/Wave/WaveScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <p className="text-gray-600 dark:text-gray-300">Loading 3D scene...</p>
    </div>
  ),
});

export default function WavePropagationPage() {
  // State for the wave settings
  const [settings, setSettings] = useState<WaveSettings>(DEFAULT_WAVE_SETTINGS);
  const [key, setKey] = useState(Date.now()); // Key for forcing re-renders

  // Handle settings changes
  const handleSettingsChange = useCallback(
    (newSettings: WaveSettings) => {
      console.log("Wave settings changing to:", newSettings);
      setSettings(newSettings);

      // Force re-render when medium or points changes
      if (
        newSettings.medium !== settings.medium ||
        newSettings.points !== settings.points
      ) {
        setKey(Date.now());
      }
    },
    [settings]
  );

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Wave Propagation Simulation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore how waves propagate through different mediums. Adjust
            parameters like amplitude, frequency, and damping to see how they
            affect wave behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Simulation controls - left column on large screens */}
          <div className="lg:col-span-1 space-y-8">
            <WaveControls
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />

            <InfoPanel settings={settings} />
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
              <WaveScene
                key={key} // Force re-render when key changes
                settings={settings}
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            The Science of Wave Propagation
          </h2>
          <div className="text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Wave propagation is the process by which a wave travels through a
              medium. The behavior of the wave—including its speed, direction,
              and interaction with other waves—depends on the properties of both
              the wave and the medium.
            </p>
            <p className="mb-4">
              When waves travel through a medium, they transfer energy from one
              point to another without permanently displacing the medium itself.
              This energy transfer can take many forms, from ocean waves and
              sound to electromagnetic radiation.
            </p>
            <p>
              The wave equation, a fundamental equation in physics, describes
              how waves propagate. For simple harmonic waves, like those in this
              simulation, the equation relates the wave&apos;s amplitude,
              frequency, wavelength, and the speed of propagation in the medium.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
