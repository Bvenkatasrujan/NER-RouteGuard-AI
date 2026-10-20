import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';
import { Radii } from './theme';

export const ClayShadows = StyleSheet.create({
  // Raised Clay Card (Medium Surface)
  card: {
    backgroundColor: Colors.claySurface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.navyDark,
        shadowOffset: { width: 6, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '6px 8px 16px rgba(11, 31, 51, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.95)',
      },
    }),
  },

  // Floating Elevated Clay Card
  cardFloating: {
    backgroundColor: Colors.claySurface,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.navyDark,
        shadowOffset: { width: 8, height: 12 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: '8px 12px 24px rgba(11, 31, 51, 0.16), -6px -6px 16px rgba(255, 255, 255, 1)',
      },
    }),
  },

  // Inset Surface (Inputs / Inner Cards)
  inset: {
    backgroundColor: Colors.clayInset,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 51, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.navyDark,
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {
        boxShadow: 'inset 3px 3px 6px rgba(11, 31, 51, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
      },
    }),
  },

  // Tactile Primary Button (Deep Navy Surface)
  buttonPrimary: {
    backgroundColor: Colors.navyDark,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.navyDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 7,
      },
      default: {
        boxShadow: '0px 6px 14px rgba(11, 31, 51, 0.3), inset 0px 2px 3px rgba(255, 255, 255, 0.25)',
      },
    }),
  },

  // Tactile Secondary Button (Soft Clay Surface)
  buttonSecondary: {
    backgroundColor: Colors.claySurface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.navyDark,
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '4px 6px 12px rgba(11, 31, 51, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.9)',
      },
    }),
  },

  // Tactile Cyan Accent Button
  buttonCyan: {
    backgroundColor: Colors.accentCyan,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.accentCyan,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '0px 6px 14px rgba(0, 166, 214, 0.35), inset 0px 2px 3px rgba(255, 255, 255, 0.4)',
      },
    }),
  }
});
