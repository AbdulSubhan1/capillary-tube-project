"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationLink {
  name: string;
  href: string;
  description: string;
}

export default function Navigation() {
  const pathname = usePathname();

  const simulationLinks: NavigationLink[] = [
    {
      name: "Home",
      href: "/",
      description: "Overview of all simulations",
    },
    {
      name: "Capillary Tube",
      href: "/simulations/capillary-tube",
      description: "Capillary action in glass tubes with different liquids",
    },
    {
      name: "Pendulum Motion",
      href: "/simulations/pendulum",
      description: "Simple and compound pendulum motion simulation",
    },
    {
      name: "Wave Propagation",
      href: "/simulations/wave-propagation",
      description: "Wave propagation through different mediums",
    },
    // More simulations can be added here
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Physics Simulations
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {simulationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "border-blue-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {simulationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? "bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
