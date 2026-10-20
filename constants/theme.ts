import { Colors } from './colors';

export const Radii = {
  sm: 14,
  md: 20,
  lg: 28,
  xl: 32,
  pill: 999,
};

export const Spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Typography = {
  largeHeading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  sectionHeading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  cardHeading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  badge: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  }
};
