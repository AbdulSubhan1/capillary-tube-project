"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { LiquidType } from "@/types/liquid";
import Controls from "@/components/Controls/Controls";
import InfoPanel from "@/components/UI/InfoPanel";
import Link from "next/link";

// Import the CapillaryScene component with dynamic loading and SSR disabled
// This prevents issues with Three.js when the component is server-rendered
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

interface SimulationCard {
  title: string;
  description: string;
  href: string;
  image?: string;
  tags: string[];
}

export default function HomePage() {
  const simulations: SimulationCard[] = [
    {
      title: "Capillary Tube",
      description:
        "Explore how different liquids behave in a glass capillary tube. Adjust the liquid type and fill level to see changes in meniscus formation and capillary action.",
      href: "/simulations/capillary-tube",
      image: "/images/capillary-tube-thumbnail.png",
      tags: ["Fluid Dynamics", "Surface Tension", "Three.js"],
    },
    {
      title: "Pendulum Motion",
      description:
        "Visualize the motion of simple and compound pendulums. Adjust parameters like length, mass, and initial angle to observe how they affect the pendulum's behavior.",
      href: "/simulations/pendulum",
      image: "/images/pendulum-thumbnail.png",
      tags: ["Mechanics", "Oscillation", "Three.js"],
    },
    {
      title: "Wave Propagation",
      description:
        "Explore how waves propagate through different mediums. Adjust parameters like amplitude, frequency, and damping to see how they affect wave behavior.",
      href: "/simulations/wave-propagation",
      image: "/images/wave-thumbnail.png",
      tags: ["Waves", "Physics", "Three.js"],
    },
    // Add more simulations here as they are developed
  ];

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Interactive Physics Simulations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore physics concepts through interactive 3D visualizations.
            These educational tools help you understand complex phenomena in an
            intuitive way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {simulations.map((sim) => (
            <Link
              key={sim.href}
              href={sim.href}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {sim.image ? (
                  <img
                    src={sim.image}
                    alt={`${sim.title} simulation thumbnail`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-2xl font-bold">
                    {sim.title}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {sim.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {sim.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sim.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            About This Project
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            This collection of physics simulations is built using Next.js,
            React, TypeScript, and Three.js. The goal is to create interactive,
            educational tools that help visualize complex physics concepts in an
            engaging way.
          </p>
          <div className="mt-8">
            <a
              href="https://github.com/AbdulSubhan1/capillary-tube-project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Created with Next.js, TypeScript, and Three.js</p>
        </footer>
      </main>
    </div>
  );
}
