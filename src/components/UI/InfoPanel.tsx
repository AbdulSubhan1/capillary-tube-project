"use client";

import { useState } from "react";
import { LiquidType, LIQUID_DATA } from "@/types/liquid";

interface InfoPanelProps {
  liquidType: LiquidType;
}

export default function InfoPanel({ liquidType }: InfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generalInfo = `
    Capillary action is the ability of a liquid to flow into narrow spaces without the assistance of, or even in opposition to, external forces like gravity. This phenomenon is a result of intermolecular forces between the liquid and surrounding surfaces.
  `;

  const liquidInfo = LIQUID_DATA[liquidType].description;

  // Customized additional information based on liquid type
  const additionalInfo = {
    water:
      "Water shows strong capillary action in glass tubes due to hydrogen bonding. It can rise several centimeters in very thin tubes.",
    mercury:
      "Mercury displays negative capillary action (depression) in glass because mercury atoms attract each other more strongly than they are attracted to glass.",
    oil: "Oils typically have lower surface tension than water and demonstrate less pronounced capillary effects. Their high viscosity also slows the capillary rise.",
    alcohol:
      "Alcohols like ethanol have lower surface tension than water, which affects their capillary behavior. Their ability to wet surfaces easily affects meniscus formation.",
  };

  // Meniscus explanation based on the type
  const meniscusInfo = {
    concave:
      "The concave meniscus forms because the adhesive forces (attraction between liquid and container) exceed cohesive forces (attraction within the liquid).",
    convex:
      "The convex meniscus forms because the cohesive forces within the liquid exceed the adhesive forces between the liquid and container.",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          About Capillary Action
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
                {liquidType.charAt(0).toUpperCase() + liquidType.slice(1)} in
                Capillary Tubes
              </h3>
              <p>{liquidInfo}</p>
              <p className="mt-2">{additionalInfo[liquidType]}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Meniscus Formation
              </h3>
              <p>
                {LIQUID_DATA[liquidType].meniscusType === "concave"
                  ? meniscusInfo.concave
                  : meniscusInfo.convex}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Capillary Action Formula
              </h3>
              <p>
                The height (h) of liquid in a capillary tube can be calculated
                using:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 my-2 text-center font-mono">
                h = (2γ·cos(θ)) / (ρ·g·r)
              </div>
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>γ = surface tension</li>
                <li>θ = contact angle</li>
                <li>ρ = density of the liquid</li>
                <li>g = gravitational acceleration</li>
                <li>r = radius of the tube</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
