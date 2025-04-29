"use client";

import { useState } from "react";
import { WaveSettings, MEDIUM_PROPERTIES } from "@/types/wave";

interface InfoPanelProps {
  settings: WaveSettings;
}

export default function InfoPanel({ settings }: InfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generalInfo = `
    Waves are disturbances that travel through a medium, transferring energy without transferring matter. The properties of the medium determine how the wave propagates, including its speed and behavior.
  `;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          About Wave Propagation
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <div className="text-gray-600 dark:text-gray-300 text-sm space-y-4">
        <p>{generalInfo}</p>

        {isExpanded && (
          <>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Types of Waves
              </h3>
              <p className="mb-2">
                Waves can be classified into different types:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium">Mechanical waves</span> -
                  require a medium to travel through (sound, water waves)
                </li>
                <li>
                  <span className="font-medium">Electromagnetic waves</span> -
                  can travel through vacuum (light, radio)
                </li>
                <li>
                  <span className="font-medium">Transverse waves</span> -
                  oscillate perpendicular to the direction of travel
                </li>
                <li>
                  <span className="font-medium">Longitudinal waves</span> -
                  oscillate parallel to the direction of travel
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Wave Properties
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium">Amplitude</span> - the maximum
                  displacement of the wave from equilibrium
                </li>
                <li>
                  <span className="font-medium">Wavelength</span> - the distance
                  between successive wave peaks
                </li>
                <li>
                  <span className="font-medium">Frequency</span> - the number of
                  complete wave cycles per second
                </li>
                <li>
                  <span className="font-medium">Speed</span> - the rate at which
                  the wave propagates through the medium
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Wave Equation
              </h3>
              <p>
                The speed of a wave relates to its frequency and wavelength:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 my-2 text-center font-mono">
                v = f × λ
              </div>
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>v = wave speed</li>
                <li>f = frequency</li>
                <li>λ (lambda) = wavelength</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Current Medium:{" "}
                {settings.medium.charAt(0).toUpperCase() +
                  settings.medium.slice(1)}
              </h3>
              <p>{MEDIUM_PROPERTIES[settings.medium].description}</p>
              <div className="mt-2">
                <p>
                  In this simulation, waves in {settings.medium} travel at a
                  relative speed of{" "}
                  {MEDIUM_PROPERTIES[settings.medium].speed.toFixed(1)}.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
