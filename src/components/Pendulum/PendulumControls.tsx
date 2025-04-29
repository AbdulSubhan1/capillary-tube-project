"use client";

import { useState, useEffect } from "react";
import { PendulumSettings, DEFAULT_PENDULUM_SETTINGS } from "@/types/pendulum";

interface PendulumControlsProps {
  settings: PendulumSettings;
  onSettingsChange: (settings: PendulumSettings) => void;
}

export default function PendulumControls({
  settings,
  onSettingsChange,
}: PendulumControlsProps) {
  // Local state for sliders
  const [localSettings, setLocalSettings] =
    useState<PendulumSettings>(settings);

  // Update local state when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle slider changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: keyof PendulumSettings
  ) => {
    const value = parseFloat(e.target.value);
    const newSettings = { ...localSettings, [property]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Reset to defaults
  const handleReset = () => {
    setLocalSettings(DEFAULT_PENDULUM_SETTINGS);
    onSettingsChange(DEFAULT_PENDULUM_SETTINGS);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Pendulum Controls
        </h2>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Length slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="length"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Length
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.length.toFixed(1)} m
            </span>
          </div>
          <input
            type="range"
            id="length"
            min="0.5"
            max="5"
            step="0.1"
            value={localSettings.length}
            onChange={(e) => handleChange(e, "length")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Mass slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="mass"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mass
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.mass.toFixed(1)} kg
            </span>
          </div>
          <input
            type="range"
            id="mass"
            min="0.1"
            max="3"
            step="0.1"
            value={localSettings.mass}
            onChange={(e) => handleChange(e, "mass")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Initial angle slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="initialAngle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Initial Angle
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((localSettings.initialAngle * 180) / Math.PI)}°
            </span>
          </div>
          <input
            type="range"
            id="initialAngle"
            min="0"
            max={Math.PI * 0.9}
            step="0.01"
            value={localSettings.initialAngle}
            onChange={(e) => handleChange(e, "initialAngle")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Gravity slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="gravity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Gravity
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.gravity.toFixed(1)} m/s²
            </span>
          </div>
          <input
            type="range"
            id="gravity"
            min="1"
            max="20"
            step="0.1"
            value={localSettings.gravity}
            onChange={(e) => handleChange(e, "gravity")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Damping slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="damping"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Damping
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.damping.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            id="damping"
            min="0"
            max="0.2"
            step="0.01"
            value={localSettings.damping}
            onChange={(e) => handleChange(e, "damping")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Settings
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const earthSettings = { ...localSettings, gravity: 9.8 };
              setLocalSettings(earthSettings);
              onSettingsChange(earthSettings);
            }}
            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
          >
            Earth
          </button>
          <button
            onClick={() => {
              const moonSettings = { ...localSettings, gravity: 1.6 };
              setLocalSettings(moonSettings);
              onSettingsChange(moonSettings);
            }}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded"
          >
            Moon
          </button>
          <button
            onClick={() => {
              const marsSettings = { ...localSettings, gravity: 3.7 };
              setLocalSettings(marsSettings);
              onSettingsChange(marsSettings);
            }}
            className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded"
          >
            Mars
          </button>
        </div>
      </div>
    </div>
  );
}
