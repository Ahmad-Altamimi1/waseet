// Aura App Typography System
export const typography = {
  // Font families
  fonts: {
    primary: "System", // Uses system font for now, can be replaced with custom fonts
    secondary: "System",
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
    "6xl": 48,
  },

  // Font weights
  weights: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
  },
} as const;

// Text style presets
export const textStyles = {
  // Headers
  h1: {
    fontSize: typography.sizes["4xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },
  h2: {
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  h3: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  h4: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
  },

  // Body text
  bodyLarge: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
  },
  body: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },

  // Special text
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  button: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  accent: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
  },
} as const;
