import { colors } from "./colors";
import { typography } from "./typography";

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  accent: {
    shadowColor: colors.shadow.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
} as const;

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Component styles
export const componentStyles = {
  card: {
    backgroundColor: colors.primary.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  button: {
    primary: {
      backgroundColor: colors.accent.lavender,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.md,
    },
    secondary: {
      backgroundColor: colors.primary.beige,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border.accent,
    },
  },
  input: {
    backgroundColor: colors.primary.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    fontSize: typography.sizes.base,
  },
} as const;

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  componentStyles,
} as const;

export type Theme = typeof theme;
