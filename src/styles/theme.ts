/**
 * Theme configuration with colors, spacing, and typography tokens
 * Supports light and dark mode with responsive scaling
 */

import type {Breakpoint} from '@utils/breakpoints';

export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  primary: '#000000',
  secondary: '#8E8E93',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  error: '#FF3B30',
  success: '#34C759',
  border: '#E5E5EA',
  text: '#000000',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
  like: '#FF3040',
  transparent: 'transparent',
} as const;

export const darkColors = {
  primary: '#FFFFFF',
  secondary: '#8E8E93',
  background: '#000000',
  surface: '#1C1C1E',
  error: '#FF453A',
  success: '#30D158',
  border: '#38383A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
  like: '#FF3040',
  transparent: 'transparent',
} as const;

/**
 * Base spacing values (for mobile/phone)
 * Scales up for tablet/desktop breakpoints
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Responsive spacing scale multipliers by breakpoint
 * Applied to base spacing values for larger screens
 */
export const spacingScale: Record<Breakpoint, number> = {
  xs: 1.0, // Base scale for extra small
  sm: 1.0, // Base scale for small (phone)
  md: 1.25, // 25% larger for tablet
  lg: 1.5, // 50% larger for large tablet
  xl: 1.75, // 75% larger for desktop
} as const;

/**
 * Get responsive spacing value for a given breakpoint
 */
export const getResponsiveSpacing = (
  baseSpacing: keyof typeof spacing,
  breakpoint: Breakpoint,
): number => {
  const base = spacing[baseSpacing];
  const scale = spacingScale[breakpoint];
  return Math.round(base * scale);
};

/**
 * Base typography values (for mobile/phone)
 * Scales up for tablet/desktop breakpoints
 */
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
} as const;

/**
 * Responsive typography scale multipliers by breakpoint
 * Applied to base font sizes for larger screens
 */
export const typographyScale: Record<Breakpoint, number> = {
  xs: 1.0, // Base scale for extra small
  sm: 1.0, // Base scale for small (phone)
  md: 1.125, // 12.5% larger for tablet
  lg: 1.25, // 25% larger for large tablet
  xl: 1.375, // 37.5% larger for desktop
} as const;

/**
 * Get responsive font size for a given breakpoint
 */
export const getResponsiveFontSize = (
  baseSize: keyof typeof typography.fontSize,
  breakpoint: Breakpoint,
): number => {
  const base = typography.fontSize[baseSize];
  const scale = typographyScale[breakpoint];
  return Math.round(base * scale);
};

/**
 * Get responsive line height for a given breakpoint
 */
export const getResponsiveLineHeight = (
  baseSize: keyof typeof typography.lineHeight,
  breakpoint: Breakpoint,
): number => {
  const base = typography.lineHeight[baseSize];
  const scale = typographyScale[breakpoint];
  return Math.round(base * scale);
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
} as const;

/**
 * Get theme colors based on mode
 */
export const getThemeColors = (mode: ThemeMode) => {
  return mode === 'light' ? lightColors : darkColors;
};

/**
 * Create theme object for a specific mode
 * Note: Responsive spacing and typography should be accessed via getResponsiveSpacing,
 * getResponsiveFontSize, and getResponsiveLineHeight functions with breakpoint from useBreakpoint hook
 */
export const createTheme = (mode: ThemeMode) => {
  return {
    mode,
    colors: getThemeColors(mode),
    spacing,
    typography,
    borderRadius,
    // Helper functions for responsive values
    getResponsiveSpacing,
    getResponsiveFontSize,
    getResponsiveLineHeight,
  } as const;
};

export type Theme = ReturnType<typeof createTheme>;

