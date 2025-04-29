"use client";

import { useState } from "react";
import { PendulumSettings } from "@/types/pendulum";

interface InfoPanelProps {
  settings: PendulumSettings;
}

export default function InfoPanel({ settings }: InfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generalInfo = `
    A pendulum is a weight suspended from a pivot so that it can swing freely. When a pendulum is displaced from its resting equilibrium position, it is subject to a restoring force due to gravity that will accelerate it back toward the equilibrium position.
  `;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          About Pendulum Motion
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
                Mathematical Description
              </h3>
              <p>
                For small displacements, the motion of a pendulum follows the
                simple harmonic motion equation. The period (T) of a simple
                pendulum is:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 my-2 text-center font-mono">
                T = 2π√(L/g)
              </div>
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>L = the length of the pendulum</li>
                <li>g = the acceleration due to gravity</li>
                <li>π = Pi (approximately 3.14159)</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Physics Principles
              </h3>
              <p>
                The pendulum demonstrates several important physics principles:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Conservation of energy (between potential and kinetic energy)
                </li>
                <li>Simple harmonic motion (for small angles)</li>
                <li>The effects of damping/friction on oscillatory systems</li>
                <li>How period is affected by length but not by mass</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Current Settings
              </h3>
              <p>
                With the current settings, the pendulum has a theoretical period
                of approximately:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 my-2 text-center font-mono">
                {(
                  2 *
                  Math.PI *
                  Math.sqrt(settings.length / settings.gravity)
                ).toFixed(2)}{" "}
                seconds
              </div>
              <p>
                Note: This formula is exact only for small oscillations. For
                larger angles, the period increases slightly.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
