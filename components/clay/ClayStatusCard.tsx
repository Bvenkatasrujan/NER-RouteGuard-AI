import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ClayCard } from './ClayCard';
import { ClayBadge, RiskLevel } from './ClayBadge';
import { Typography } from '../../constants/theme';
import { Colors } from '../../constants/colors';

interface ClayStatusCardProps {
  title: string;
  status: RiskLevel | string;
  description: string;
  style?: StyleProp<ViewStyle>;
}

export const ClayStatusCard: React.FC<ClayStatusCardProps> = ({
  title,
  status,
  description,
  style,
}) => {
  return (
    <ClayCard variant="floating" style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={Typography.cardHeading}>{title}</Text>
        <ClayBadge status={status} />
      </View>
      <Text style={styles.description}>{description}</Text>
    </ClayCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
