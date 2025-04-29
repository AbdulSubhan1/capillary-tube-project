"use client";

import { useState, useEffect } from "react";
import { LiquidType, LIQUID_DATA } from "@/types/liquid";

interface ControlsProps {
  liquidType: LiquidType;
  fillLevel: number;
  onLiquidTypeChange: (liquidType: LiquidType) => void;
  onFillLevelChange: (fillLevel: number) => void;
}

export default function Controls({
  liquidType,
  fillLevel,
  onLiquidTypeChange,
  onFillLevelChange,
}: ControlsProps) {
  // Local state to track slider value during dragging
  const [sliderValue, setSliderValue] = useState(fillLevel);

  // Update local state when props change (in case it's updated elsewhere)
  useEffect(() => {
    setSliderValue(fillLevel);
  }, [fillLevel]);

  // Handle slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);

    // Debounce the update slightly to avoid too many renders during dragging
    requestAnimationFrame(() => {
      onFillLevelChange(newValue);
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Simulation Controls
      </h2>

      <div className="space-y-6">
        {/* Liquid Type Selection */}
        <div>
          <label
            htmlFor="liquidType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Liquid Type
          </label>
          <select
            id="liquidType"
            value={liquidType}
            onChange={(e) => onLiquidTypeChange(e.target.value as LiquidType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="water">Water</option>
            <option value="mercury">Mercury</option>
            <option value="oil">Oil</option>
            <option value="alcohol">Alcohol</option>
          </select>

          {/* Liquid Information */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {LIQUID_DATA[liquidType].description}
          </div>
        </div>

        {/* Fill Level Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="fillLevel"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fill Level
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(sliderValue * 100)}%
            </span>
          </div>

          <input
            type="range"
            id="fillLevel"
            min="0"
            max="1"
            step="0.01"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Empty</span>
            <span>Full</span>
          </div>

          {/* Quick fill buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onFillLevelChange(0.25)}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              25%
            </button>
            <button
              onClick={() => onFillLevelChange(0.5)}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              50%
            </button>
            <button
              onClick={() => onFillLevelChange(0.75)}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              75%
            </button>
            <button
              onClick={() => onFillLevelChange(1.0)}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Properties Display */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Liquid Properties
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Viscosity:</span>
            <span className="ml-2 text-gray-800 dark:text-white">
              {LIQUID_DATA[liquidType].viscosity.toFixed(1)}
            </span>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Meniscus Type:
            </span>
            <span className="ml-2 text-gray-800 dark:text-white capitalize">
              {LIQUID_DATA[liquidType].meniscusType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
