import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/theme';

interface LogoProps {
  size?: number;
  showText?: boolean;
  subtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 100, showText = false, subtitle = false }) => {
  const scale = size / 100;

  return (
    <View style={styles.container}>
      {/* Outer Soft Clay Badge */}
      <View style={[styles.clayBadge, { width: size, height: size, borderRadius: size * 0.3 }]}>
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100" fill="none">
          <Defs>
            {/* Mountain Gradient */}
            <LinearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0B1F33" />
              <Stop offset="100%" stopColor="#1769AA" />
            </LinearGradient>
            {/* Route Gradient */}
            <LinearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#00A6D6" />
              <Stop offset="100%" stopColor="#38BDF8" />
            </LinearGradient>
            {/* Pin Shield Gradient */}
            <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#EAF1F7" stopOpacity="0.7" />
            </LinearGradient>
          </Defs>

          {/* Outer Pin Body */}
          <Path
            d="M 50 10 C 30 10 16 24 16 44 C 16 66 50 90 50 90 C 50 90 84 66 84 44 C 84 24 70 10 50 10 Z"
            fill="url(#pinGrad)"
            stroke="#1769AA"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Mountain Silhouettes */}
          {/* Back Mountain */}
          <Path
            d="M 28 62 L 44 38 L 58 58 L 72 38 L 80 62 Z"
            fill="#1769AA"
            opacity="0.35"
          />
          {/* Main Front Mountain */}
          <Path
            d="M 24 64 L 46 32 L 62 56 L 76 64 Z"
            fill="url(#mountainGrad)"
          />

          {/* Curved Route Line */}
          <Path
            d="M 24 70 Q 42 55 50 64 T 76 50"
            stroke="url(#routeGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* AI Network Nodes (Dots & Connectors) */}
          {/* Node 1 */}
          <Circle cx="24" cy="70" r="3.5" fill="#00A6D6" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Node 2 */}
          <Circle cx="50" cy="64" r="4" fill="#00A6D6" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Node 3 */}
          <Circle cx="76" cy="50" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Top AI Pulse Node */}
          <Circle cx="50" cy="25" r="3" fill="#00A6D6" />

          {/* Small Node Connection Ray */}
          <Path
            d="M 50 25 L 50 32"
            stroke="#00A6D6"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
        </Svg>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={Typography.largeHeading}>NER-RouteGuard AI</Text>
          {subtitle && (
            <Text style={styles.subtitleText}>
              Predict • Protect • Deliver
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clayBadge: {
    backgroundColor: Colors.claySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: Colors.navyDark,
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  subtitleText: {
    ...Typography.bodyMedium,
    color: Colors.accentCyan,
    marginTop: 4,
    letterSpacing: 1.2,
    fontSize: 13,
    textTransform: 'uppercase',
  },
});
