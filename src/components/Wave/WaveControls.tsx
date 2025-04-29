"use client";

import { useState, useEffect } from "react";
import {
  WaveSettings,
  WaveMedium,
  MEDIUM_PROPERTIES,
  DEFAULT_WAVE_SETTINGS,
} from "@/types/wave";

interface WaveControlsProps {
  settings: WaveSettings;
  onSettingsChange: (settings: WaveSettings) => void;
}

export default function WaveControls({
  settings,
  onSettingsChange,
}: WaveControlsProps) {
  // Local state for sliders
  const [localSettings, setLocalSettings] = useState<WaveSettings>(settings);

  // Update local state when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle slider changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: keyof WaveSettings
  ) => {
    const value = parseFloat(e.target.value);
    const newSettings = { ...localSettings, [property]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Handle medium selection
  const handleMediumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const medium = e.target.value as WaveMedium;
    const newSettings = { ...localSettings, medium };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Reset to defaults
  const handleReset = () => {
    setLocalSettings(DEFAULT_WAVE_SETTINGS);
    onSettingsChange(DEFAULT_WAVE_SETTINGS);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Wave Controls
        </h2>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Medium selection */}
        <div>
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Medium
          </label>
          <select
            id="medium"
            value={localSettings.medium}
            onChange={handleMediumChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="water">Water</option>
            <option value="air">Air</option>
            <option value="string">String</option>
            <option value="metal">Metal</option>
          </select>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {MEDIUM_PROPERTIES[localSettings.medium].description}
          </div>
        </div>

        {/* Amplitude slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="amplitude"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amplitude
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.amplitude.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            id="amplitude"
            min="0.1"
            max="1.5"
            step="0.05"
            value={localSettings.amplitude}
            onChange={(e) => handleChange(e, "amplitude")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Frequency slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Frequency
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.frequency.toFixed(1)} Hz
            </span>
          </div>
          <input
            type="range"
            id="frequency"
            min="0.2"
            max="3"
            step="0.1"
            value={localSettings.frequency}
            onChange={(e) => handleChange(e, "frequency")}
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
              {localSettings.damping.toFixed(3)}
            </span>
          </div>
          <input
            type="range"
            id="damping"
            min="0"
            max="0.1"
            step="0.001"
            value={localSettings.damping}
            onChange={(e) => handleChange(e, "damping")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Resolution slider (points) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Resolution
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSettings.points}
            </span>
          </div>
          <input
            type="range"
            id="points"
            min="20"
            max="150"
            step="5"
            value={localSettings.points}
            onChange={(e) => handleChange(e, "points")}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Higher values give smoother waves but may reduce performance
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Wave Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const newSettings = {
                ...localSettings,
                amplitude: 0.8,
                frequency: 0.5,
                damping: 0.01,
              };
              setLocalSettings(newSettings);
              onSettingsChange(newSettings);
            }}
            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
          >
            Ocean Waves
          </button>
          <button
            onClick={() => {
              const newSettings = {
                ...localSettings,
                amplitude: 0.3,
                frequency: 2.5,
                damping: 0.005,
              };
              setLocalSettings(newSettings);
              onSettingsChange(newSettings);
            }}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded"
          >
            Ripples
          </button>
          <button
            onClick={() => {
              const newSettings = {
                ...localSettings,
                amplitude: 1.2,
                frequency: 1.0,
                damping: 0.03,
              };
              setLocalSettings(newSettings);
              onSettingsChange(newSettings);
            }}
            className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded"
          >
            Tsunami
          </button>
        </div>
      </div>
    </div>
  );
}
