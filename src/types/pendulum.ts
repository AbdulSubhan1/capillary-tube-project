export interface PendulumProps {
  length: number; // Length of the pendulum string
  mass: number; // Mass of the bob
  initialAngle: number; // Initial angle in radians
  gravity: number; // Gravity constant
  damping: number; // Damping factor (air resistance)
}

export interface PendulumSettings {
  length: number;
  mass: number;
  initialAngle: number;
  gravity: number;
  damping: number;
}

// Default settings for the pendulum
export const DEFAULT_PENDULUM_SETTINGS: PendulumSettings = {
  length: 2,
  mass: 1,
  initialAngle: Math.PI / 4, // 45 degrees
  gravity: 9.8,
  damping: 0.05,
};
