// /lib/theme.ts
export const colors = {
  background: "#C5CBDC",
  primary: "#4A9FF5",
  cardBackground: "#D4D8E8",
  white: "#FFFFFF",
  textPrimary: "#000000",
  textSecondary: "#6B7280",
  success: "#22C55E",
  accent: "#F97316",
};

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
};

export type Theme = typeof theme;
