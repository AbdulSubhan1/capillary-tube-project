export type WaveMedium = "water" | "air" | "string" | "metal";

export interface WaveSettings {
  amplitude: number; // Height of the wave
  frequency: number; // Frequency of the wave
  damping: number; // How quickly the wave loses energy
  medium: WaveMedium; // Medium through which the wave propagates
  points: number; // Number of points to use for the wave (resolution)
}

export interface WaveProps {
  settings: WaveSettings;
}

// Default settings for the wave simulation
export const DEFAULT_WAVE_SETTINGS: WaveSettings = {
  amplitude: 0.5,
  frequency: 1.0,
  damping: 0.02,
  medium: "water",
  points: 100,
};

// Medium-specific properties
export const MEDIUM_PROPERTIES: Record<
  WaveMedium,
  {
    color: string;
    speed: number;
    description: string;
  }
> = {
  water: {
    color: "#3498db",
    speed: 1.0,
    description:
      "Waves in water travel at moderate speeds and show interesting surface patterns.",
  },
  air: {
    color: "#ecf0f1",
    speed: 1.5,
    description:
      "Sound waves in air travel faster than in water but slower than in solids.",
  },
  string: {
    color: "#e74c3c",
    speed: 0.7,
    description:
      "Waves on a string show clear transverse movement and reflections.",
  },
  metal: {
    color: "#95a5a6",
    speed: 2.0,
    description:
      "Waves in solid metal travel very quickly with minimal damping.",
  },
};
