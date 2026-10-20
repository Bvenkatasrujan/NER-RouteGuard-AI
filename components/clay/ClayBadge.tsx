import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radii, Typography } from '../../constants/theme';

export type RiskLevel = 'SAFE' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'BLOCKED';

interface ClayBadgeProps {
  status: RiskLevel | string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({ status, label, style }) => {
  const getBadgeColors = () => {
    switch (status.toUpperCase()) {
      case 'SAFE':
      case 'OPERATIONAL':
        return {
          bg: Colors.successBg,
          dot: Colors.success,
          text: Colors.success,
          border: 'rgba(22, 163, 74, 0.3)',
        };
      case 'CAUTION':
      case 'MODERATE':
        return {
          bg: Colors.warningBg,
          dot: Colors.warning,
          text: Colors.warning,
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'HIGH':
      case 'HIGH RISK':
        return {
          bg: Colors.dangerBg,
          dot: Colors.danger,
          text: Colors.danger,
          border: 'rgba(220, 38, 38, 0.3)',
        };
      case 'CRITICAL':
        return {
          bg: Colors.criticalBg,
          dot: Colors.critical,
          text: Colors.whiteHighlight,
          border: Colors.critical,
        };
      case 'BLOCKED':
      default:
        return {
          bg: Colors.blocked,
          dot: Colors.whiteHighlight,
          text: Colors.whiteHighlight,
          border: Colors.navyDark,
        };
    }
  };

  const colors = getBadgeColors();
  const displayLabel = label || status;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }, style]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[Typography.badge, { color: colors.text }]}>
        {displayLabel.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    shadowColor: Colors.navyDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});
