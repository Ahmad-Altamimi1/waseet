// Aura App Color Palette
export const colors = {
  // Base pastel colors
  primary: {
    beige: "#F5F1E8",
    blushPink: "#F8E8E5",
    lightLavender: "#F0EBFF",
    white: "#FFFFFF",
    offWhite: "#FEFEFE",
  },

  // Accent colors
  accent: {
    lavender: "#A855F7",
    gold: "#F59E0B",
    deepLavender: "#9333EA",
    lightGold: "#FCD34D",
  },

  // Neutral colors
  neutral: {
    gray100: "#F7FAFC",
    gray200: "#EDF2F7",
    gray300: "#E2E8F0",
    gray400: "#CBD5E0",
    gray500: "#A0AEC0",
    gray600: "#718096",
    gray700: "#4A5568",
    gray800: "#2D3748",
    gray900: "#1A202C",
  },

  // Status colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  // Background gradients
  gradients: {
    primaryGradient: ["#F5F1E8", "#F8E8E5"],
    accentGradient: ["#A855F7", "#9333EA"],
    goldGradient: ["#F59E0B", "#FCD34D"],
    lightGradient: ["#FFFFFF", "#F0EBFF"],
  },

  // Text colors
  text: {
    primary: "#1A202C",
    secondary: "#4A5568",
    accent: "#A855F7",
    light: "#718096",
    white: "#FFFFFF",
  },

  // Border colors
  border: {
    light: "#E2E8F0",
    medium: "#CBD5E0",
    accent: "#A855F7",
  },

  // Shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.05)",
    medium: "rgba(0, 0, 0, 0.1)",
    dark: "rgba(0, 0, 0, 0.2)",
    accent: "rgba(168, 85, 247, 0.2)",
  },
} as const;

export type ColorKeys = keyof typeof colors;
