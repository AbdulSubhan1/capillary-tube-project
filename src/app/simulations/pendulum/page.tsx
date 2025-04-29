"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_PENDULUM_SETTINGS, PendulumSettings } from "@/types/pendulum";
import PendulumControls from "@/components/Pendulum/PendulumControls";
import InfoPanel from "@/components/Pendulum/InfoPanel";

// Import the PendulumScene component with dynamic loading and SSR disabled
const PendulumScene = dynamic(
  () => import("@/components/Pendulum/PendulumScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <p className="text-gray-600 dark:text-gray-300">Loading 3D scene...</p>
      </div>
    ),
  }
);

export default function PendulumPage() {
  // State for the pendulum settings
  const [settings, setSettings] = useState<PendulumSettings>(
    DEFAULT_PENDULUM_SETTINGS
  );
  const [key, setKey] = useState(Date.now()); // Key for forcing re-renders

  // Handle settings changes
  const handleSettingsChange = useCallback(
    (newSettings: PendulumSettings) => {
      console.log("Pendulum settings changing to:", newSettings);
      setSettings(newSettings);

      // Force re-render for significant changes
      if (
        Math.abs(newSettings.length - settings.length) > 0.5 ||
        Math.abs(newSettings.initialAngle - settings.initialAngle) > 0.5
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
            Pendulum Motion Simulation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the physics of pendulum motion. Adjust parameters like
            length, mass, and gravity to see how they affect the pendulum's
            behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Simulation controls - left column on large screens */}
          <div className="lg:col-span-1 space-y-8">
            <PendulumControls
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
              <PendulumScene
                key={key}
                length={settings.length}
                mass={settings.mass}
                initialAngle={settings.initialAngle}
                gravity={settings.gravity}
                damping={settings.damping}
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
            The Science Behind Pendulums
          </h2>
          <div className="text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Pendulums are an excellent example of periodic motion and have
              been studied extensively in physics for centuries. They were the
              main timekeeping element in mechanical clocks until the 1930s.
            </p>
            <p className="mb-4">
              The motion of a pendulum is an example of mechanical energy
              conservation, as the energy continuously transforms between
              potential energy (at the endpoints of swing) and kinetic energy
              (at the lowest point).
            </p>
            <p>
              For small oscillations, a pendulum's motion approximates simple
              harmonic motion. This means its period (time for one complete
              swing) is independent of the amplitude, which is why pendulums
              were so useful for timekeeping.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
