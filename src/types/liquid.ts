export type LiquidType = "water" | "mercury" | "oil" | "alcohol";

export interface LiquidProperties {
  color: string;
  meniscusHeight: number;
  meniscusType: "concave" | "convex";
  viscosity: number;
  opacity: number;
  description: string;
}

export interface CapillaryTubeSettings {
  liquidType: LiquidType;
  fillLevel: number;
  tubeHeight: number;
  tubeRadius: number;
}

export const LIQUID_DATA: Record<LiquidType, LiquidProperties> = {
  water: {
    color: "#3498db",
    meniscusHeight: 0.05,
    meniscusType: "concave",
    viscosity: 1,
    opacity: 0.8,
    description:
      "Water has a concave meniscus due to adhesive forces with glass being stronger than cohesive forces within the liquid.",
  },
  mercury: {
    color: "#bdc3c7",
    meniscusHeight: 0.03,
    meniscusType: "convex",
    viscosity: 1.5,
    opacity: 1,
    description:
      "Mercury forms a convex meniscus because cohesive forces within the liquid are stronger than adhesive forces with glass.",
  },
  oil: {
    color: "#f1c40f",
    meniscusHeight: 0.02,
    meniscusType: "concave",
    viscosity: 2,
    opacity: 0.7,
    description:
      "Oil creates a slight concave meniscus and has high viscosity, resulting in slower movement.",
  },
  alcohol: {
    color: "#e74c3c",
    meniscusHeight: 0.06,
    meniscusType: "concave",
    viscosity: 0.8,
    opacity: 0.75,
    description:
      "Alcohol has a more pronounced concave meniscus and lower viscosity than water, allowing for quicker rise in capillary tubes.",
  },
};
